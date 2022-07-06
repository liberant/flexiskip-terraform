const Dispute = require('../../models/dispute');
const Product = require('../../models/product');
const DisputeNote = require('../../models/dispute-note');
const User = require('../../models/user');
const EmailHelper = require('../../helpers/email');
const moment = require('moment');

const {
  getQueryData,
  validateStatus,
} = require('./helpers');
const {
  validationExc,
  notFoundExc,
  serverExc,
} = require('../../../common/helpers');
const {
  getPaymentMethod,
  createAndChargeFutileBinPaymentIntent,
} = require('../../../common/payment');

async function getDisputes(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const total = (await Dispute.aggregate(query.pipelines)).length;
    const items = await Dispute.aggregate(query.pipelines)
      .sort({ _id: -1 })
      .skip(query.offset)
      .limit(query.limit);

    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(items);
  } catch (err) {
    return next(err);
  }
}

async function getDisputeDetail(req, res, next) {
  try {
    const item = await Dispute.findOne({
      _id: req.params.id,
    }).populate('collectionRequest')
      .populate('reporter')
      .populate('user');

    if (!item) {
      return next(notFoundExc('No data found'));
    }

    // check if has gc product
    const productIds = item.collectionRequest.items.map(i => i.product);
    const gcProductCount = await Product.countDocuments({
      _id: productIds,
      prefix: 'gc'
    })
    const result = item.toObject();
    result.hasGCProduct = gcProductCount > 0;

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateDispute(req, res, next) {
  try {
    const data = req.body;
    const errors = validateStatus(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }
    const item = await Dispute.findById(req.params.id)
      .populate('collectionRequest')
      .populate('reporter')
      .populate('user');
    if (!item) {
      return next(notFoundExc('No data found'));
    }

    item.status = data.status;
    await item.save();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function chargeFutile(req, res, next) {
  try {
    const includePhotoEvidence = JSON.parse(req.query.includePhotoEvidence || false);
    const dispute = await Dispute.findOne({
      _id: req.params.id,
    })
    .populate('user')
    .populate({
      path: 'collectionRequest',
      populate: ['items.bin'],
    });

    if (!dispute) return next(notFoundExc('Dispute not found'));
    if (dispute.futileBinPaymentIntentId) return next(validationExc('Dispute has already been charged for futile'));

    if (dispute.user && dispute.user.residentialCustomerProfile){
      const customerId = dispute.user.residentialCustomerProfile.payment.stripeCustomerId;
      if (!customerId) return next(notFoundExc('No Stripe customer Id found.'));

      const collectionRequestCreatedAt = dispute.collectionRequest.createdAt
      const binStatusUpdatedAt = dispute.collectionRequest.items[0].bin.statusUpdatedAt;

      const isGCExpired = moment(binStatusUpdatedAt).isSameOrBefore(moment(collectionRequestCreatedAt).subtract(30, 'days'))

      let paymentMethods, paymentType;
      if (isGCExpired) {
        const allPaymentMethods = await getPaymentMethod(customerId);
        paymentMethods = allPaymentMethods.filter(pm => pm.metadata.trigger !== 'gcc-violation-charge');
      } else {
        paymentMethods = await getPaymentMethod(customerId, 'gcc-violation-charge');
        paymentType = 'gcc'
      }

      if (paymentMethods.length == 0) return next(notFoundExc('No GCC payment method found.'));

      paymentMethodId = paymentMethods[0].id;

      const paymentIntent = await createAndChargeFutileBinPaymentIntent(customerId, paymentMethodId, paymentType);

      if (paymentIntent.status == 'succeeded') {
        dispute.futileBinPaymentIntentId = paymentIntent.id;
        await dispute.save();

        //add note
        const note = new DisputeNote({
          dispute: req.params.id,
          user: null,
          content: `A futile charge has been processed. Stripe Payment id: ${paymentIntent.id}`,
        });
        await note.save();

        //send mail notification
        EmailHelper.sendNotifyFutileCharge(dispute, includePhotoEvidence);
      } else {
        return next(serverExc('Payment intent not succeeded.'));
      }
    } else {
      return next(notFoundExc('Residential customer profile not found.'));
    }

    return res.json({
      status: "Charged futile successfully."
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getDisputes,
  getDisputeDetail,
  updateDispute,
  chargeFutile
};
