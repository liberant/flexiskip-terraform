const validate = require('validate.js');
const Coupon = require('../../models/coupon');
const { escapeRegExp, randomString } = require('../../../common/helpers');

async function validateCouponData(data) {
  validate.validators.validateExtraProducts = async (value) => {
    if (!Array.isArray(value)) {
      return 'is invalid, only array is accepted';
    }

    if (value.length === 0) {
      return "can't be blank";
    }

    const constraints = {
      product: {
        presence: { allowEmpty: false, message: "^Bonus product can't be blank" },
      },
      quantity: {
        presence: {
          allowEmpty: false, message: "^Bonus quantity can't be blank",
        },
      },
    };

    const promises = value.map(item => validate.async(item, constraints, { format: 'grouped' }));
    let errors;
    try {
      await Promise.all(promises);
    } catch (err) {
      errors = err;
    }

    return errors;
  };

  validate.validators.validateRequest = (value) => {
    const arrayValid = [Coupon.REQUEST_TYPE_BIN, Coupon.REQUEST_TYPE_COLLECTION];

    if (!Array.isArray(value)) {
      return 'is not an array';
    }
    const checkRequest = value.filter(x => arrayValid.includes(x));
    return checkRequest.length <= 0 ? '^Apply Request is not allowed' : '';
  };

  validate.validators.codeNotExists = async (value) => {
    const coupon = await Coupon.findOne({
      code: value,
    });
    return !coupon
      ? Promise.resolve()
      : Promise.resolve('is already existed.');
  };

  let errors;
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
    name: {
      presence: { allowEmpty: false },
    },
    dateStart: {
      presence: {
        allowEmpty: false, message: "^Start Date can't be blank",
      },
    },
    dateEnd: {
      presence: { allowEmpty: false, message: "^End Date can't be blank" },
    },
    code: data.action !== 'update' ? {
      presence: { allowEmpty: false },
      codeNotExists: true,
    } : null,
    request: {
      presence: { allowEmpty: false, message: "^Apply Request can't be blank" },
      validateRequest: true,
    },
    type: {
      presence: { allowEmpty: false, message: "^Discount Type can't be blank" },
      inclusion: {
        within: [
          Coupon.TYPE_PERCENTAGE,
          Coupon.TYPE_FLAT,
          Coupon.TYPE_EXTRA,
          Coupon.TYPE_FREE,
        ],
        message: '^Discount Type is not allowed',
      },
    },
    discount: {
      numericality: {
        greaterThanOrEqualTo: 0,
        message: '^Discount Amount must be a number and greater than or equal to 0',
      },
    },
    quantity: {
      presence: { allowEmpty: false, message: "^Maximum Usage can't be blank" },
      numericality: {
        greaterThanOrEqualTo: 0,
        message: '^Maximum Usage must be a number and greater than or equal to 0',
      },
    },
    minProdQty: {
      numericality: {
        greaterThanOrEqualTo: 0,
        message: '^Minximum Product must be a number and greater than or equal to 0',
      },
    },
    minPrice: {
      numericality: {
        greaterThanOrEqualTo: 0,
        message: '^Minximum Price must be a number and greater than or equal to 0',
      },
    },
    extraProducts: {
      validateExtraProducts: data.type === Coupon.TYPE_EXTRA,
    },
  };

  try {
    await validate.async(data, rules, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

function getQueryData({
  limit = 10, page = 1, sort = 'dateStart', dir = 'desc', s,
}) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    organisation: { $exists: false },
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

    sort: { [sort]: dir === 'desc' ? -1 : 1 },
  };
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

async function generateCouponCode() {
  const code = randomString(8);
  const coupon = await Coupon.findOne({ code });
  if (coupon) {
    return generateCouponCode();
  }
  return code;
}

module.exports = {
  validateCouponData,
  getQueryData,
  validateStatusData,
  generateCouponCode,
};
