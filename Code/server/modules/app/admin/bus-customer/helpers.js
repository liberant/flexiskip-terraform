const validate = require('validate.js');
const User = require('../../models/user');
const Product = require('../../models/product');
const Coupon = require('../../models/coupon');
const { escapeRegExp } = require('../../../common/helpers');

/**
 * Validate business customer data
 * @param {Object} data
 */
function validateBusinessCustomerData(data) {
  const rules = {
    abn: {
      presence: { allowEmpty: false },
      length: { is: 11 },
    },
    businessName: {
      presence: { allowEmpty: false },
    },
    address: {
      presence: { allowEmpty: false },
    },
    phone: {
      presence: { allowEmpty: false },
      length: { is: 10 },
    },
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [
          User.STATUS_ACTIVE,
          User.STATUS_INACTIVE,
          User.STATUS_UNAVAILABLE,
          User.STATUS_SUSPENDED,
          User.STATUS_REMOVED,
          User.STATUS_PENDING,
        ],
        message: 'is not allowed',
      },
    },
    paymentTypes: {
      presence: { allowEmpty: false },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

/**
 * Validate business customer data
 * @param {Object} data
 */
async function validateCreateBusinessCustomerData(data) {
  validate.validators.emailNotExists = async (value) => {
    const user = await User.findOne({
      email: value,
    });
    return !user
      ? Promise.resolve()
      : Promise.resolve('is already registered.');
  };
  let errors;
  const rules = {
    abn: {
      presence: { allowEmpty: false },
      length: { is: 11 },
    },
    businessName: {
      presence: { allowEmpty: false },
    },
    address: {
      presence: { allowEmpty: false },
    },
    phone: {
      presence: { allowEmpty: false },
      length: { is: 10 },
    },
    firstname: {
      presence: { allowEmpty: false },
    },
    lastname: {
      presence: { allowEmpty: false },
    },
    email: {
      presence: { allowEmpty: false },
      email: true,
      emailNotExists: true,
    },
  };
  try {
    await validate.async(data, rules, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

async function getCouponQueryData(req) {
  const { sort = 'dateStart', dir = 'desc', s } = req.query;
  const user = await User.findById(req.params.id);
  const conditions = {
    organisation: user.businessCustomerProfile.organisation,
  };
  if (s) {
    conditions.$or = [
      { code: new RegExp(escapeRegExp(s), 'i') },
      { name: new RegExp(escapeRegExp(s), 'i') },
    ];
  }

  // calculate offset
  return {
    conditions,
    sort: { [sort]: dir === 'desc' ? -1 : 1 },
  };
}

/**
 * Validate connected customer data
 * @param {Object} data
 */
function validateConnectedCustomerData(data) {
  const rules = {
    'organisation.address': {
      presence: { allowEmpty: false },
    },
    email: {
      presence: { allowEmpty: false },
    },
    firstname: {
      presence: { allowEmpty: false },
    },
    lastname: {
      presence: { allowEmpty: false },
    },
    phone: {
      presence: { allowEmpty: false },
      length: { is: 10 },
    },
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [
          User.STATUS_ACTIVE,
          User.STATUS_INACTIVE,
          User.STATUS_UNAVAILABLE,
          User.STATUS_SUSPENDED,
          User.STATUS_REMOVED,
          User.STATUS_PENDING,
        ],
        message: 'is not allowed',
      },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

async function validateProductPrices(items) {
  const rules = {
    product: {
      presence: { allowEmpty: false },
      productExists: true,
    },
  };

  validate.validators.productExists = async (value) => {
    const product = await Product.findById(value);
    if (!product) {
      return 'is not exists';
    }
    return undefined;
  };
  try {
    await Promise.all(items.map(item => validate.async(item, rules, { format: 'grouped' })));
  } catch (err) {
    return err;
  }
  return undefined;
}

function validateStatusData(data) {
  const rules = {
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [
          Coupon.STATUS_ACTIVE,
          Coupon.STATUS_INACTIVE,
          Coupon.STATUS_REMOVED,
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

module.exports = {
  validateBusinessCustomerData,
  validateCreateBusinessCustomerData,
  getCouponQueryData,
  validateConnectedCustomerData,
  validateProductPrices,
  validateStatusData,
};
