const mongoose = require('mongoose');
const validate = require('validate.js');
const moment = require('moment');
const Counter = require('../common/models/counter');
const logger = require('../common/log');
const config = require('../../config');
const Coupon = require('./models/coupon');
const State = require('./models/state');
const Council = require('./models/council');
const Bin = require('./models/bin');
const Notification = require('./models/notification');
const CollectionRequest = require('./models/collection-request');
const Promise = require('bluebird');


const { ObjectId } = mongoose.Types;

const {
  PAYMENT_TYPE_INVOICE,
} = require('./models/payment');

const {
  sendFCM, arrayOverlap, pad, timeout,
} = require('../common/helpers');
const { parseAddress, track } = require('../common/shipping');

async function generateProductCode() {
  const c = await Counter.findOneAndUpdate(
    { type: 'product' },
    { $inc: { value: 1 } },
    { upsert: true, new: true },
  );
  const baseCounter = 0;
  const prefix = 'H';
  return prefix + pad(c.value + baseCounter, 4);
}

async function generateBinRequestCode() {
  const c = await Counter.findOneAndUpdate(
    { type: 'binRequest' },
    { $inc: { value: 1 } },
    { upsert: true, new: true },
  );
  const baseCounter = 1234;
  const prefix = 'BR';
  return prefix + (c.value + baseCounter);
}

async function generateBinCode() {
  const c = await Counter.findOneAndUpdate(
    { type: 'bin' },
    { $inc: { value: 1 } },
    { upsert: true, new: true },
  );
  const baseCounter = 1234;
  const prefix = 'QR-';
  return prefix + (c.value + baseCounter);
}

async function generateCollectionRequestCode() {
  const c = await Counter.findOneAndUpdate(
    { type: 'collectionRequest' },
    { $inc: { value: 1 } },
    { upsert: true, new: true },
  );
  const baseCounter = 1234;
  const prefix = 'CR';
  return prefix + (c.value + baseCounter);
}

async function generateUserCode() {
  const c = await Counter.findOneAndUpdate(
    { type: 'user' },
    { $inc: { value: 1 } },
    { upsert: true, new: true },
  );
  const baseCounter = 1234;
  const prefix = 'USR';
  return prefix + (c.value + baseCounter);
}

async function generateVehicleCode() {
  const c = await Counter.findOneAndUpdate(
    { type: 'vehicle' },
    { $inc: { value: 1 } },
    { upsert: true, new: true },
  );
  const baseCounter = 1234;
  const prefix = 'VHC';
  return prefix + (c.value + baseCounter);
}

async function generateDumpsiteCode() {
  const c = await Counter.findOneAndUpdate(
    { type: 'dumpsite' },
    { $inc: { value: 1 } },
    { upsert: true, new: true },
  );
  const baseCounter = 1234;
  const prefix = 'DS';
  return prefix + (c.value + baseCounter);
}

async function sendFCMToCustomer(customer, title, body, data) {
  if (!customer.fcmToken) {
    logger.warn(`Customer ${customer.email} doesn't has a device token. FCM was not send.`);
    return false;
  }

  if (!data.type) {
    throw new Error('Invalid parameters: notification type must be specified.');
  }

  // save notification
  const notification = new Notification({
    type: data.type,
    user: customer._id,
    title,
    body,
    data,
  });
  await notification.save();

  // send firebase cloud message to customer device
  return sendFCM(config.customerFcmApiKey, customer.fcmToken, title, body, data);
}

function sendFCMToDriver(deviceToken, title, body, data) {
  return sendFCM(config.driverFcmApiKey, deviceToken, title, body, data);
}

async function getCouncilByAddress(address) {
  if (!address) {
    return null;
  }

  const { postalCode } = await parseAddress(address);
  if (!postalCode) {
    return null;
  }
  const council = await Council.findOne({
    postCodes: postalCode,
    status: Council.STATUS_ACTIVE,
  });
  return council;
}

async function validateDiscountCode(value, { order, requestType }) {
  if (!value) {
    return undefined;
  }

  const codeQty = {
    normal: 0,
    customer: 0,
  };

  async function validateSingleCode(code) {
    const coupon = await Coupon.findOne({ code });
    const today = new Date();
    // check coupon's status
    if (!coupon || coupon.status !== Coupon.STATUS_ACTIVE) {
      return '^This code is invalid';
    }

    // check coupon's date start
    if (today > coupon.dateEnd) {
      return '^This code is expired';
    }

    // check coupon's date end
    if (coupon.dateStart > today) {
      return '^This code can not be used now';
    }

    // check coupon quantity
    if (coupon.quantity <= 0) {
      return '^This code had reached maximum usage.';
    }

    // check coupon minimum ordered quantity
    const ordQty = order.items.reduce((sum, item) =>
      sum + item.quantity, 0);
    if (ordQty < coupon.minProdQty) {
      return "^Your order does not meet coupon's minimum product quantity";
    }

    // check coupon minimum ordered amount
    const totalProdPrice = order.items.reduce((sum, item) => sum + item.total, 0);
    const subTotal = totalProdPrice / 1.1;
    if (subTotal < coupon.minPrice) {
      return "^Your order does not meet coupon's minimum amount";
    }

    // check coupon applicable request types
    if (!coupon.request.includes(requestType)) {
      return 'can not be used for this kind of request';
    }

    // check coupon apllicable products
    const orderProducts = order.toObject().items.map(item => item.product.toString());
    const couponProducts = coupon.toObject().products.map(item => item.toString());
    if (couponProducts.length > 0
      && !arrayOverlap(orderProducts, couponProducts)) {
      return '^No products matched to use with this code';
    }

    // increase the number of discount code by type
    if (coupon.organisation) {
      codeQty.customer += 1;
    } else {
      codeQty.normal += 1;
    }

    // get address
    const address = requestType === Coupon.REQUEST_TYPE_BIN ?
      order.shippingAddress : order.collectionAddress;
    // skip region checking if there are no regions specified
    // ignore if user do not enter address
    if (!coupon.regions || coupon.regions.length === 0 || !address) {
      return undefined;
    }

    // get the council associated with order's address
    // if that council isn't in the allowed councils
    // speficied in the coupon, return error
    const council = await getCouncilByAddress(address);
    const allowedCouncils = coupon.regions.map(c => c.toString());
    if (!council || !allowedCouncils.includes(council._id.toString())) {
      return 'can not be used for your region';
    }

    return undefined;
  }

  const codes = value;
  const results = await Promise.all(codes.map(code => validateSingleCode(code)));

  if (codeQty.customer > 1) {
    return '^You can only apply one business discount code';
  }

  return results.find(result => !!result);
}

/**
 * Apply discount amount to order
 * @param {object} order the order object, bin request or collection request
 * @param {string} requestType type of the request, bin or collection
 */
async function applyDiscount(order, requestType) {
  const codes = order.discountCodes;
  if (!codes) return;

  order.discount = 0;
  async function getDiscountAmt(code) {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return 0;

    switch (coupon.type) {
      case Coupon.TYPE_FLAT:
        logger.info('coupon type flat');
        return coupon.discount;

      case Coupon.TYPE_PERCENTAGE: {
        logger.info('coupon type percentage');
        let total = 0;
        if (coupon.products.length === 0) {
          logger.info('- apply to all products');
          total = order.subTotal;
        } else {
          logger.info('- apply to some items');
          const items = order.items.filter(item =>
            coupon.products.some(prodId => prodId.toString() === item.product.toString()));
          total = items.reduce((sum, item) => sum + item.total, 0);
        }
        return total * (coupon.discount / 100);
      }

      case Coupon.TYPE_EXTRA: {
        logger.info('coupon type extra');
        let dscAmt = 0;
        coupon.extraProducts.forEach((extra) => {
          let matchedItem;
          if (requestType === Coupon.REQUEST_TYPE_BIN) {
            matchedItem = order.items.find(i =>
              i.product._id.toString() === extra.product.toString() &&
              i.quantity >= extra.quantity);
            if (matchedItem) {
              dscAmt += matchedItem.price * Math.trunc(matchedItem.quantity / extra.quantity);
            }
          } else {
            matchedItem = order.items.find(item =>
              item.bin.product.toString() === extra.product.toString());
            dscAmt += matchedItem.total;
          }
        });
        return dscAmt;
      }

      case Coupon.TYPE_FREE: {
        logger.info('coupon type free');
        let total = 0;
        if (coupon.products.length === 0) {
          logger.info('- apply to whole order');
          return order.total;
        }

        logger.info('- apply to some products');
        const items = order.items.filter(item =>
          coupon.products.some(prodId => prodId.toString() === item.product.toString()));
        total = items.reduce((sum, item) => sum + item.total, 0);
        return total;
      }

      default:
        return 0;
    }
  }

  const values = await Promise.all(codes.map(code => getDiscountAmt(code)));
  const dscAmt = values.reduce((sum, item) => sum + item, 0);
  order.discount += dscAmt;
  order.total = order.total > dscAmt ? order.total - dscAmt : 0;
}

/**
 * Check address has location
 * @param {String} address
 */
async function validateAddress(address) {
  try {
    await parseAddress(address);
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve('^Address is invalid');
  }
}

/**
 * Check address is australia delivery address
 * @param {String} address
 */
async function validateAustraliaAddress(address, { allowEmpty = true }) {
  try {
    if (!address || !address.length) {
      return allowEmpty ? Promise.resolve() : Promise.resolve('must not be empty');
    }

    const { country, postalCode } = await parseAddress(address);
    if (!postalCode || country !== 'Australia') {
      return Promise.resolve('is not a valid Australia address');
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve('is invalid');
  }
}

function validateEventData(data) {
  const rules = {
    type: {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

async function validateUniqueEmail(email, { message }) {
  const User = require('./models/user');
  const user = await User.findOne({
    email,
  });
  return !user
    ? Promise.resolve()
    : Promise.resolve(message || 'is already existed.');
}

/**
 * Notification sent when a driver accept a collection request
 */
function sendJobAcceptedNotifToCustomer(colReq) {
  const data = {
    type: Notification.TYPE_DRIVER_ACCEPT_REQ,
    collectionRequestId: colReq._id,
  };
  const { driver } = colReq;
  const driverName = `${driver.firstname}`;
  const title = 'Request has been accepted';
  const body = `Your collection request has been accepted by your local driver ${driverName}`;
  return sendFCMToCustomer(colReq.customer, title, body, data);
}

async function getState(address) {
  const { postalCode } = await parseAddress(address);
  const state = await State.findOne({ postCodes: postalCode });
  return state ? state.name : null;
}

/**
 * Send notification to customer, bin is ready for collection by Fastway
 * @param {Object} bin
 */
async function sendBinReadyNotifToCustomer(binRequest) {
  if (!binRequest.enableNotification) return false;
  await binRequest.populate('customer').execPopulate();
  const title = '';
  const body = 'Your order has been packed and is awaiting collection by our local courier.';
  const data = {
    type: Notification.TYPE_BIN_READY,
    binRequestId: binRequest._id,
  };
  return sendFCMToCustomer(binRequest.customer, title, body, data);
}

/**
 * Send notification to customer about picked up bin
 * @param {Object} bin
 */
async function sendBinDispatchedNotifToCustomer(binRequest) {
  if (!binRequest.enableNotification) return false;
  await binRequest.populate('customer').execPopulate();
  const title = '';
  const body = 'Your order has been picked up by our local courier. Keep an eye out for your tracking email from the courier.';
  const data = {
    type: Notification.TYPE_BIN_DISPATCHED,
    binRequestId: binRequest._id,
  };
  return sendFCMToCustomer(binRequest.customer, title, body, data);
}

/**
 * Send notification to customer about delivered bin
 * @param {Object} bin
 */
async function sendBinDeliveredNotifToCustomer(binRequest) {
  if (!binRequest.enableNotification) return false;
  await binRequest.populate('customer').execPopulate();
  const title = '';
  const body = 'Your order has been delivered by your local courier. Time to get to work!!';
  const data = {
    type: Notification.TYPE_BIN_DELIVERIED,
    binRequestId: binRequest._id,
  };
  return sendFCMToCustomer(binRequest.customer, title, body, data);
}

/**
 * Perform a Fastway status lookup and map it with our delivery status
 * @param {Object} bin
 */
async function lookupBinDeliveryStatus(bin) {
  // Scans of type D include the statuses below so
  const deliveredStatus = ['YES', 'ATL', 'LAI', 'PRS', 'R34', 'R35', 'R36', 'DRU', 'NEI', 'PCY', 'ALL', 'YEA', 'CLS']
  const nonDeliveredStatus = ['UNA', 'CCL', 'CCQ', 'UND', 'U01', 'U02', 'U03', 'U04', 'U05', 'U06', 'U07']
  const trackingData = await track(bin.fastwayLabel);
  if (!trackingData) {
    return bin.status;
  }
  const lastScan = trackingData.Scans.slice(-1)[0];
  switch (lastScan.Type) {
    // Your parcel has been picked up for delivery by our courier.
    // Your parcel is currently in transit.
    case 'P':
    case 'T':
      return Bin.STATUS_DISPATCHED;

    // Your parcel has been delivered as per your instructions.
    case 'D':
      if (lastScan.Status && deliveredStatus.indexOf(lastScan.Status) > -1){
        return Bin.STATUS_DELIVERED
      }
      if (lastScan.Status && nonDeliveredStatus.indexOf(lastScan.Status) > -1){
        return Bin.STATUS_DISPATCHED
      }
      return bin.status;

    default:
      return bin.status;
  }
}

/**
 * Find undelivered bins and update their status
 * base on status retrieved from Fastway
 */
async function trackBinDeliveryStatuses() {
  try {
    const bins = await Bin.find({ status: { $nin: [Bin.STATUS_DELIVERED, Bin.STATUS_PENDING, Bin.STATUS_CANCELLED] } });
    await Promise.all(bins.map(async (bin) => {
      const status = await lookupBinDeliveryStatus(bin);
      await bin.updateDeliveryStatus(status);
    }));
  } catch (error) {
    logger.error("Error when polling updating bin's status");
    logger.error(error.message);
    logger.error(error.stack);
  }
}

/**
 * Simulating shipping process by performimg automatically status
 * updating without Fastway notification
 * @param {Object} bin
 */
async function simulateFastwayProcess(bin) {
  await timeout(10000); // wait 10 secs
  await bin.updateDeliveryStatus(Bin.STATUS_DISPATCHED);

  await timeout(10000); // wait 10 secs
  await bin.updateDeliveryStatus(Bin.STATUS_DELIVERED);
}

/**
 * Find drivers who license is expire on next n days
 * @param {Number} days
 */
async function findExpiredDrivers(days) {
  const User = require('./models/user');
  // send notification email for driver that have license expire on next 30 days
  const ndate = moment().add(days, 'days');
  const drivers = await User.find({
    roles: User.ROLE_DRIVER,
    status: User.STATUS_ACTIVE,
    'driverProfile.licence.expiryDate': {
      $gt: ndate.startOf('day').toDate(),
      $lt: ndate.endOf('day').toDate(),
    },
  });
  return drivers;
}

/**
 * Get Business Contractor
 */
async function getBusinessContractor(driver) {
  const User = require('./models/user');
  const businessContractors = await User.aggregate([{
    $match: {
      roles: User.ROLE_CONTRACTOR,
      'contractorProfile.organisation': driver.driverProfile.organisation,
      status: {
        $eq: User.STATUS_ACTIVE,
      },
    },
  }]);
  return businessContractors;
}

/**
 * Find drivers who license is expire on next n days
 * @param {Number} days
 */
async function sendLicenseExpiredEmail(days) {
  const drivers = await findExpiredDrivers(days);
  const EmailHelper = require('./helpers/email');

  drivers.forEach(async (driver) => {
    EmailHelper.sendLicenseExpireEmailToDriver(driver);
    // send email to business contractor
    const contractors = await getBusinessContractor(driver);
    contractors.forEach(contractor =>
      EmailHelper.sendLicenseExpireEmailToAdmin(driver, contractor));

    EmailHelper.sendLicenseExpireEmailToAdmin(driver);
  });
}

/**
 * Suspend driver account was expiry license on Yesterday
 */
async function suspendDriverAccountWasExpiredLicenseOnYesterday() {
  const User = require('./models/user');

  const ndate = moment();

  /**
   * Find all driver account is acctive and has expiry license on yesterday
   */
  const drivers = await User.find({
    roles: User.ROLE_DRIVER,
    status: {
      $ne: User.STATUS_SUSPENDED,
      $eq: User.STATUS_ACTIVE,
    },
    'driverProfile.licence.expiryDate': {
      $lt: ndate.startOf('day').toDate(),
    },
  });

  /**
   * Suspend driver account
   */
  drivers.forEach((driver) => {
    driver.status = User.STATUS_SUSPENDED;
    driver.save();
  });
}

async function handleDriverLicenseExpiration() {
  // send notification email for driver that have license expire on next 30 days
  sendLicenseExpiredEmail(30);

  // send notification email for driver that have license expire on next 7 days
  sendLicenseExpiredEmail(7);

  // suspend driver accounts who license was expired on yesterday
  suspendDriverAccountWasExpiredLicenseOnYesterday();
}

function validateDateOfIssued(date) {
  const dateOfIssue = moment(date);
  if (dateOfIssue.isSameOrAfter(moment())) {
    return 'is not allowed to enter a date in the future';
  }

  return undefined;
}

function validateExpiryDate(date) {
  const expiryDate = moment(date);
  if (expiryDate.isBefore(moment())) {
    return 'is not allowed to enter a date in the past';
  }

  return undefined;
}

// validate invoice code if customer using the invoice method
async function validateInvoiceCode(invoiceCode, { order }) {
  try {
    if (order.paymentType === PAYMENT_TYPE_INVOICE) {
      if (!invoiceCode) {
        return Promise.resolve('must not be empty');
      }
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve('is invalid');
  }
}

// validate invoice payment method
// and total order compare with maximum amount spend per order
async function validateInvoicePaymentMethod(paymentType, { order }) {
  try {
    if (paymentType === PAYMENT_TYPE_INVOICE) {
      const User = require('./models/user');
      const { organisation } = await (await User.findById(order.customer)).toUserObject();
      const invoicePaymentMethod = organisation.paymentTypes
        .find(pt => pt.type === PAYMENT_TYPE_INVOICE);

      if (!invoicePaymentMethod) {
        return Promise.resolve('is not enabled');
      }
      if (order.total > invoicePaymentMethod.maximumInvoice) {
        return Promise.resolve('value is exceed the maximum amount per order');
      }
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve('is invalid');
  }
}

/** Validate collection request includes bin which is exist on other request */
async function validateBinAvailability(item) {
  const bin = await Bin.findById(item);
  if (bin.isOrderable()) return undefined;

  // const CollectionRequest = require('./models/collection-request');
  const pipelines = [
    {
      $match: {
        status: {
          $in: [
            CollectionRequest.STATUS_REQUESTED,
            CollectionRequest.STATUS_ACCEPTED,
            CollectionRequest.STATUS_IN_PROGRESS,
            CollectionRequest.STATUS_COMPLETED
          ],
        },
        items: {
          $elemMatch: {
            bin: {
              $eq: ObjectId(item),
            },
          },
        },
      },
    },
  ];
  const collectRequest = await CollectionRequest.aggregate(pipelines);
  if (collectRequest && collectRequest.length > 0) {
    return Promise.resolve(`${bin.code} already booked on request ${collectRequest[0].code}`);
  }
  return undefined;
}


module.exports = {
  generateProductCode,
  generateDumpsiteCode,
  generateBinRequestCode,
  generateBinCode,
  generateUserCode,
  generateCollectionRequestCode,
  generateVehicleCode,
  sendFCMToCustomer,
  sendFCMToDriver,
  validateAddress,
  validateAustraliaAddress,
  validateDiscountCode,
  validateEventData,
  applyDiscount,
  getCouncilByAddress,
  sendJobAcceptedNotifToCustomer,
  validateUniqueEmail,
  getState,
  simulateFastwayProcess,
  trackBinDeliveryStatuses,
  sendBinReadyNotifToCustomer,
  sendBinDispatchedNotifToCustomer,
  sendBinDeliveredNotifToCustomer,
  handleDriverLicenseExpiration,
  validateDateOfIssued,
  validateExpiryDate,
  validateInvoiceCode,
  validateInvoicePaymentMethod,
  validateBinAvailability,
};
