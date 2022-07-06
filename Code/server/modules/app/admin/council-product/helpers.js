const validate = require('validate.js');
const { validationExc } = require('../../../common/helpers');
const Product = require('../../models/product');

function getQueryData({ limit = 10, page = 1, product }) {
  if (!product) {
    throw validationExc('Product\'s id is required when listing council products');
  }
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    product,
    type: Product.TYPE_COUNCIL,
    status: { $ne: Product.STATUS_REMOVED },
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

/**
 * Validate form data of Advertisement
 */
function validateFormData(data) {
  const rules = {
    name: {
      presence: { allowEmpty: false },
    },
    resBinPrice: {
      presence: { allowEmpty: false },
    },
    busBinPrice: {
      presence: { allowEmpty: false },
    },
    resColPrice: {
      presence: { allowEmpty: false },
    },
    busColPrice: {
      presence: { allowEmpty: false },
    },
    startDate: {
      presence: { allowEmpty: false },
    },
    endDate: {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

function validateStatus(data) {
  const rules = {
    status: {
      presence: true,
      inclusion: {
        within: [
          Product.STATUS_ACTIVE,
          Product.STATUS_UNAVAILABLE,
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

module.exports = {
  getQueryData,
  validateFormData,
  validateStatus,
};
