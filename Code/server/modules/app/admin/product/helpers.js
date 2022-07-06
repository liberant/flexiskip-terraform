const validate = require('validate.js');
const Product = require('../../models/product');
const { escapeRegExp } = require('../../../common/helpers');

// validate update profile
function validateProductData(data) {
  const constraints = {
    name: {
      presence: { allowEmpty: false },
    },
    wasteType: {
      presence: { allowEmpty: false },
    },
    residentialPrice: {
      presence: { allowEmpty: false },
      numericality: true,
    },
    businessPrice: {
      presence: { allowEmpty: false },
      numericality: true,
    },
    resColPrice: {
      presence: { allowEmpty: false },
      numericality: true,
    },
    busColPrice: {
      presence: { allowEmpty: false },
      numericality: true,
    },
    quantity: {
      presence: { allowEmpty: false },
      numericality: {
        greaterThanOrEqualTo: 0,
      },
    },
    'size.length': {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        greaterThan: 0,
      },
    },
    'size.width': {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        greaterThan: 0,
      },
    },
    'size.height': {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        greaterThan: 0,
      },
    },
    weight: {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        greaterThan: 0,
        lessThan: 25,
      },
    },
    weightAllowance: {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        greaterThan: 0,
      },
    },
    materialsAllowance: {
      presence: { allowEmpty: false },
    },
    status: {
      presence: { allowEmpty: false },
    },
    prefix: {
      presence: { allowEmpty: false },
    },
  };

  return validate(data, constraints, { format: 'grouped' });
}

function getQueryData({ limit = 10, page = 1, s }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    status: { $ne: Product.STATUS_REMOVED },
    type: Product.TYPE_NORMAL,
  };
  if (s) {
    conditions.$or = [
      { code: new RegExp(escapeRegExp(s), 'i') },
      { name: new RegExp(escapeRegExp(s), 'i') },
    ];
  }

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    conditions,
    limit: limit2,
    page,
    offset,
  };
}

module.exports = {
  getQueryData,
  validateProductData,
};
