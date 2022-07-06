const validate = require('validate.js');
const Bin = require('../../models/bin');
const Counter = require('../../../common/models/counter');
const { parseAddress } = require('../../../common/shipping');
const CollectionRequest = require('../../models/collection-request');
const {
  PAYMENT_TYPE_STRIPE,
  PAYMENT_TYPE_INVOICE,
} = require('../../models/payment');

const {
  validateDiscountCode,
  validateInvoiceCode,
  validateInvoicePaymentMethod,
  validateBinAvailability,
} = require('../../helpers');

async function validateCartData(data, customer, cart) {
  validate.Promise = global.Promise;
  validate.validators.validateDiscountCode = validateDiscountCode;
  validate.validators.validateInvoiceCode = validateInvoiceCode;
  validate.validators.validateInvoicePaymentMethod = validateInvoicePaymentMethod;
  validate.validators.isArray = value => (!Array.isArray(value) ? 'is invalid' : undefined);
  validate.validators.binExists = async (value) => {
    const bin = await Bin.findOne({
      _id: value,
      status: Bin.STATUS_DELIVERED,
    });
    return bin
      ? Promise.resolve()
      : Promise.resolve('does not exist');
  };
  validate.validators.binAvailable = validateBinAvailability;

  const constraints = {
    discountCodes: {
      validateDiscountCode: { order: cart, requestType: 'collection' },
    },
    items: {
      isArray: true,
    },
    paymentType: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [
          PAYMENT_TYPE_STRIPE,
          PAYMENT_TYPE_INVOICE,
        ],
        message: 'is not allowed',
      },
      validateInvoicePaymentMethod: { order: cart },
    },
    invoiceCode: {
      validateInvoiceCode: { order: cart },
    },
  };

  let errors;
  try {
    await validate.async(data, constraints, { format: 'grouped' });
    // validate order items
    await Promise.all(data.items.map(item => validate.async(
      item,
      {
        bin: {
          presence: { allowEmpty: false },
          binExists: true,
          binAvailable: true,
        },
      },
      { format: 'grouped' },
    )));
  } catch (err) {
    errors = err;
  }
  return errors;
}

function getQueryData({ limit = 10, page = 1 }, userId) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    customer: userId,
    status: {
      $ne: CollectionRequest.STATUS_DRAFT,
    },
  };

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    conditions,
    limit: limit2,
    page,
    offset,
  };
}

async function validateCollectionRequest(data) {
  validate.validators.hasLocation = async (value) => {
    try {
      const { location } = await parseAddress(value);
      if (!location) {
        return 'is wrong, no location found for this address';
      }
      return '';
    } catch (error) {
      return 'is wrong, no location found for this address';
    }
  };
  validate.validators.validateDiscountCode = validateDiscountCode;
  validate.validators.validateInvoiceCode = validateInvoiceCode;
  validate.validators.validateInvoicePaymentMethod = validateInvoicePaymentMethod;
  validate.validators.binExists = async (value) => {
    const bin = await Bin.findOne({
      _id: value,
      status: Bin.STATUS_DELIVERED,
    });
    return bin
      ? Promise.resolve()
      : Promise.resolve('does not exist');
  };
  validate.validators.binAvailable = validateBinAvailability;

  const constraints = {
    collectionAddress: {
      presence: { allowEmpty: false },
      hasLocation: true,
    },
    items: {
      presence: { allowEmpty: false },
    },
    discountCodes: {
      validateDiscountCode: { order: data, requestType: 'collection' },
    },
    paymentType: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [
          PAYMENT_TYPE_STRIPE,
          PAYMENT_TYPE_INVOICE,
        ],
        message: 'is not allowed',
      },
      validateInvoicePaymentMethod: { order: data },
    },
    invoiceCode: {
      validateInvoiceCode: { order: data },
    },
  };

  let errors;
  try {
    await validate.async(data, constraints, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

function validateColReqStatusData(data) {
  const rules = {
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [CollectionRequest.STATUS_CANCELLED],
        message: 'must be Cancelled',
      },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

function validateRatingData(data) {
  const rules = {
    point: {
      presence: { allowEmpty: false },
      numericality: {
        onlyInteger: true,
        greaterThan: 0,
        lessThanOrEqualTo: 5,
      },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

function validateReportData(data) {
  const rules = {
    reason: {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

async function resolveInvalidQRCode(code) {
  if (code !== 'H0020') return code;

  const codes = [
    'QR-1556',
    'QR-1557',
    'QR-1558',
    'QR-1559',
    'QR-1560',
    'QR-1561',
    'QR-1562',
    'QR-1563',
    'QR-1564',
    'QR-1565',
    'QR-1566',
    'QR-1567',
    'QR-1568',
    'QR-1569',
    'QR-1570',
    'QR-1571',
    'QR-1572',
    'QR-1573',
    'QR-1574',
    'QR-1575',
    'QR-1576',
    'QR-1577',
    'QR-1578',
    'QR-1579',
    'QR-1580',
    'QR-1581',
    'QR-1582',
    'QR-1583',
    'QR-1584',
    'QR-1585',
    'QR-1586',
    'QR-1587',
    'QR-1588',
    'QR-1589',
    'QR-1590',
    'QR-1591',
    'QR-1592',
    'QR-1593',
    'QR-1594',
    'QR-1595',
  ];
  const bins = await Bin.find({ code: { $in: codes } });
  const availBins = bins.filter(bin => bin.isOrderable());
  if (availBins.length === 0) return 'notExistsBin';

  const ct = await Counter.findOneAndUpdate(
    { type: 'binQRFix' },
    { $inc: { value: 1 } },
    { upsert: true, new: true },
  );
  const index = (ct.value - 1) % availBins.length;
  return availBins[index].code;
}

module.exports = {
  validateCartData,
  getQueryData,
  validateCollectionRequest,
  validateColReqStatusData,
  validateRatingData,
  validateReportData,
  resolveInvalidQRCode,
};
