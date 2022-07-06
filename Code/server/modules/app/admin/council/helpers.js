const validate = require('validate.js');
const Council = require('../../models/council');
const Product = require('../../models/product');
const { escapeRegExp } = require('../../../common/helpers');

function getQueryData({
  limit = 10, page = 1, s = '', status = '',
}) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  // calculate offset
  const offset = (page2 - 1) * limit2;

  let conditions;
  if (status && status.toLowerCase() === Council.STATUS_ACTIVE.toLowerCase()) {
    conditions = {
      status: Council.STATUS_ACTIVE,
      $or: [
        { postCodes: new RegExp(escapeRegExp(s), 'i') },
        { name: new RegExp(escapeRegExp(s), 'i') },
      ],
    };
  } else {
    conditions = s.length > 0 ? {
      $or: [
        { postCodes: new RegExp(escapeRegExp(s), 'i') },
        { name: new RegExp(escapeRegExp(s), 'i') },
      ],
    } : {};
  }

  const pipelines = [
    {
      $match: conditions,
    },
    {
      $facet: {
        total: [{ $count: "count" }],
        data: [
          { $sort: { _id: -1 } },
          { $skip: offset },
          { $limit: limit2 },
        ],
      }
    }
  ];


  return {
    pipelines,
    conditions,
    limit: limit2,
    page,
    offset,
  };
}

/**
 * Validate form data of Advertisement
 */
async function validateFormData(data, item) {
  validate.Promise = global.Promise;
  validate.validators.unique = async (value, { except = '' }) => {
    if (value === except) {
      return Promise.resolve();
    }
    const m = await Council.findOne({ code: value });
    return !m
      ? Promise.resolve()
      : Promise.resolve('^ID is already existed.');
  };

  let errors;
  const rules = {
    code: {
      presence: {
        allowEmpty: false,
        message: '^ID can be blank',
      },
      unique: { except: item._id ? item.code : '' },
    },
    name: {
      presence: { allowEmpty: false },
    },
    state: {
      presence: { allowEmpty: false },
    },
    surchage: {
      numericality: true,
    },
    postCodes: {
      presence: { allowEmpty: false },
    },
  };

  try {
    await validate.async(data, rules, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

function validateStatusData(data) {
  const rules = {
    status: {
      presence: true,
      inclusion: {
        within: [
          'Active',
          'Inactive',
          'Removed',
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

function getProductListFilter({ limit = 10, page = 1, council }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    status: { $ne: Product.STATUS_REMOVED },
    type: Product.TYPE_NORMAL,
    council,
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

module.exports = {
  getQueryData,
  validateFormData,
  validateStatusData,
  getProductListFilter,
};
