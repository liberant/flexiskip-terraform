const moment = require('moment');
const ms = require('ms');
const validate = require('validate.js');
const User = require('../../models/user');
const BinRequest = require('../../models/bin-request');
const CollectionRequest = require('../../models/collection-request');
const Bin = require('../../models/bin');
const BinRequestNote = require('../../models/bin-request-note');

const Product = require('../../models/product');

const { PAYMENT_TYPE_INVOICE, PAYMENT_TYPE_STRIPE } = require('../../models/payment');
const { validationExc } = require('../../../common/helpers');
const {
  parseAddress,
  geocoding,
} = require('../../../common/shipping');
const { generateCollectionRequestCode } = require('../../helpers');
const createMiddleware = require('../../../common/jwt');

const { collectionLifeTime, googleApiKey, gcProductIds } = require('../../../../config');
const { sendCustomerNewCollectionReq, sendGCCExpiredFlexiskipChargeReminder } = require('../../helpers/email');
const { ObjectId } = require('mongoose').Types;
const { getPaymentMethod, createAndChargeGCCViolationPaymentIntent, getPaymentIntent } = require('../../../common/payment');
const logger = require('../../../common/log');
const Promise = require('bluebird');
const _ = require('lodash');

async function createCollectionRequest(req, res, next) {
  try {
    const input = req.body;
    const { customerId } = input;
    const customer = await User.findOne({
      _id: customerId
    });
    if (!customer) throw validationExc('User not found.');

    // validate client input
    validate.Promise = global.Promise;
    validate.validators.qrCodeExists = async (value) => {
      const bin = await Bin.findOne({
        code: value,
        customer: customerId,
      });

      if (bin && bin.isOrderable()) return Promise.resolve();
      return Promise.resolve('is invalid.');
    };

    const constraints = {
      customerId: {
        presence: { allowEmpty: false },
      },
      address: {
        presence: { allowEmpty: false },
      },
      qrCode: {
        presence: { allowEmpty: false },
        qrCodeExists: true,
      },
    };
    let errors;
    try {
      await validate.async(input, constraints, { format: 'grouped' });
    } catch (err) {
      errors = err;
    }
    if (errors) {
      throw validationExc('Invalid purchase data', errors);
    }


    // create collection request
    const bin = await Bin.findOne({ code: input.qrCode });
    const product = await Product.findById(bin.product);

    let paymentIntent, price;

    if (input.paymentIntentId) {
      paymentIntent = await getPaymentIntent(input.paymentIntentId);
      price = _.round(paymentIntent.amount/100, 2);
    } else {
      price = await product.getCollectionPrice(customer, input.address);
    }

    const colReq = new CollectionRequest({
      customer: customer._id,
      paymentType: PAYMENT_TYPE_STRIPE,
      paid: true,
      additionalChargePaymentIntentId: input.paymentIntentId,
      // collectionAddressCouncilId: input.addressCouncilId,
      // collectionAddressDivision: input.addressDivision,
      items: [
        {
          bin: bin._id,
          product: bin.product,
          quantity: 1,
          price,
          total: price,
        },
      ],
    });

    // update customer payment details in db && CR price
    if (input.paymentIntentId) {
      const newDigits = paymentIntent.charges.data[0].payment_method_details.card.last4;
      customer.residentialCustomerProfile.payment.cardLast4Digits = newDigits;
      await customer.save();
    }

    await colReq.setPrices();

    const geocodedAddress = await geocoding(input.address);
    await colReq.setCollectionAddress(geocodedAddress.formatted_address);
    colReq.code = await generateCollectionRequestCode();
    colReq.createdAt = new Date();
    colReq.collectBy = moment().add(ms(collectionLifeTime), 'milliseconds').toDate();
    const { location } = await parseAddress(colReq.collectionAddress);
    colReq.collectionLocation.coordinates = [location.lng, location.lat];
    await colReq.updateStatus(CollectionRequest.STATUS_REQUESTED);

    // update data for every bins
    bin.collectionRequest = colReq._id;
    bin.collectionStatus = Bin.STATUS_REQUESTED;
    colReq.items[0].binStatus = bin.collectionStatus;
    bin.save();
    await colReq.save();
    colReq.broadcastColReqToDrivers();
    await sendCustomerNewCollectionReq(customer, 'gc')
    return res.json(colReq.toObject());
  } catch (err) {
    return next(err);
  }
}


async function getDeliveredBins(req, res, next) {
  try {
    // validate client input
    validate.Promise = global.Promise;
    validate.validators.userExists = async (value) => {
      const user = await User.findOne({
        _id: req.query.customerId
      });
      if (user) return Promise.resolve();
      return Promise.resolve('not found.');
    };

    const constraints = {
      customerId: {
        presence: { allowEmpty: false },
        userExists: true,
      }
    };

    let errors;
    try {
      await validate.async(req.query, constraints, { format: 'grouped' });
    } catch (err) {
      errors = err;
    }
    if (errors) {
      throw validationExc('Invalid request params', errors);
    }

    const { customerId } = req.query;

    const binRequests = await BinRequest.find({
      customer: customerId,
      status: {
        $nin: [ BinRequest.STATUS_DRAFT, BinRequest.STATUS_CANCELLED ]
      },
    })
    .populate({
      path: 'bins',
      populate: {
        path: 'collectionRequest',
        select: { _id: 1 },
      }
    });
    let bins = [];

    // grouping bin requests by date
    binRequests.forEach(br => {
      if (br.bins.length) {
        let deliveredBins = br.bins.filter(b => b.status === Bin.STATUS_DELIVERED && !b.collectionRequest)
        deliveredBins = deliveredBins.map(b => {
          const gcPrice = b.getGCPrice();
          return {
            _id: b._id,
            images: b.images,
            name: b.name,
            status: b.status,
            code: b.code,
            shippingAddressCouncilId: br.shippingAddressCouncilId,
            shippingAddressDivision: br.shippingAddressDivision,
            shippingAddress: br.shippingAddress,
            isGCExpired: gcPrice > 0,
            price: gcPrice,
          };
        });
        bins = bins.concat(deliveredBins);
      }
    });

    return res.json(bins);
  } catch (err) {
    return next(err);
  }
}

async function chargeExpiredFlexiskipCustomer() {
  logger.info(`[GCC Violation Cron] : Start process`);

  // Summary
  let totalCharge = 0;
  let chargedSuccess = 0;
  let chargedFailed = 0;

  let totalReminder = 0;
  let remindedSuccess = 0;
  let remindedFailed = 0;

  try {
    const [expiredDeliveredBins, nearExpiredDeliveredBins] = await Promise.all([
      Bin.find({
        status: Bin.STATUS_DELIVERED,
        product: gcProductIds,
        statusUpdatedAt: {
          $lte: moment().subtract(30, 'days').toDate()
        },
        collectionStatus: Bin.STATUS_NEW,
        $or: [
          { chargedGCCViolationFeeAt: { $exists: false } },
          { chargedGCCViolationFeeAt: null }
        ],
      }).populate('customer'),
      Bin.find({
        status: Bin.STATUS_DELIVERED,
        product: gcProductIds,
        $and: [
          { statusUpdatedAt: { $gt: moment().subtract(21, 'days').toDate() } },
          { statusUpdatedAt: { $lte: moment().subtract(20, 'days').toDate() } }
        ],
        collectionStatus: Bin.STATUS_NEW,
        $or: [
          { chargedGCCViolationFeeAt: { $exists: false } },
          { chargedGCCViolationFeeAt: null }
        ],
        $or: [
          { sentGCCViolationFeeReminderAt: { $exists: false } },
          { sentGCCViolationFeeReminderAt: null }
        ],
      }).populate('customer')
    ]);

    totalCharge = expiredDeliveredBins.length;
    totalReminder = nearExpiredDeliveredBins.length;


    // Charge expired Flexiskip
    await Promise.map(expiredDeliveredBins, async function(bin, index) {
      let customerId;
      let customerEmail;
      let paymentMethodId;
      try {
        if (bin.customer && bin.customer.residentialCustomerProfile){
          customerId = bin.customer.residentialCustomerProfile.payment.stripeCustomerId;
          customerEmail = bin.customer.email;

          const paymentMethods = await getPaymentMethod(customerId, 'gcc-violation-charge');
          paymentMethodId = paymentMethods[0].id;

          const paymentIntent = await createAndChargeGCCViolationPaymentIntent(customerId, paymentMethodId);

          bin.chargedGCCViolationFeeAt = new Date();
          bin.save();

          const note = new BinRequestNote({
            binRequest: bin.binRequest,
            user: null,
            content: `An expired FLEXiSKiP fee has been charged. Stripe Payment id: ${paymentIntent.id}`,
          });
          await note.save();

          chargedSuccess++;
          logger.info(`[GCC Violation Cron] [CHARGE] : [SUCCESS] ${customerEmail} - binId: (${bin._id})`);
        } else {
          throw "Residential Customer Profile not found";
        }
      } catch(err) {
        chargedFailed++;
        logger.error(`[GCC Violation Cron] [CHARGE] : [FAILED] ${customerEmail} - binId: (${bin._id})`, err);
      }
    }, { concurrency: 10 });


    // notify 20 days before Flexiskip expires
    await Promise.map(nearExpiredDeliveredBins, async function(bin, index) {
      let customerId;
      let customerEmail = bin.customer.email;
      try {
        sendGCCExpiredFlexiskipChargeReminder(bin.customer, 'gc');

        bin.sentGCCViolationFeeReminderAt = new Date();
        bin.save();
        remindedSuccess++;
        logger.info(`[GCC Violation Cron] [NOTIFY] : [SUCCESS] ${customerEmail} - binId: (${bin._id})`);
      } catch(err) {
        remindedFailed++;
        logger.error(`[GCC Violation Cron] [NOTIFY] : [FAILED] ${customerEmail} - binId: (${bin._id})`, err);
      }
    });

  } catch (err) {
    logger.error(`[GCC Violation Cron] : Error on process`, err);
  } finally {
    logger.info(`[GCC Violation Cron] : SUMMARY ### ${moment().format()}`);
    logger.info(`----- last 30 days: ${moment().subtract(30, 'days').format()}`);
    logger.info(`----- last 20 days (start): ${moment().subtract(21, 'days').format()}`);
    logger.info(`----- last 20 days (end): ${moment().subtract(20, 'days').format()}`);
    logger.info(`----- charged : Total: ${totalCharge}/ Success: ${chargedSuccess}/ Failed: ${chargedFailed}/`);
    logger.info(`----- reminded : Total: ${totalReminder}/ Success: ${remindedSuccess}/ Failed: ${remindedFailed}/`);
  }
}

module.exports = {
  createCollectionRequest,
  getDeliveredBins,
  chargeExpiredFlexiskipCustomer
};
