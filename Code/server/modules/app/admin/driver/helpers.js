const moment = require('moment');
const validate = require('validate.js');
const User = require('../../models/user');
const { escapeRegExp } = require('../../../common/helpers');

function validateStatusChange(data, { licence, message }) {
  const expiryDate = moment(licence.expiryDate);
  if (expiryDate.isSameOrBefore(moment()) && data === User.STATUS_ACTIVE) {
    return message;
  }
  return undefined;
}

/**
 * Validate contractor login data
 * @param {Object} data
 */
async function validateDriverData(data, type = null) {
  if (type) {
    validate.Promise = global.Promise;

    validate.validators.emailNotExists = async (value) => {
      const user = await User.findOne({
        email: value,
      });
      return !user
        ? Promise.resolve()
        : Promise.resolve('is already existed.');
    };
  }
  let errors;
  const rules = {
    email: type ? {
      presence: true,
      email: true,
      emailNotExists: true,
    } : null,
    firstname: {
      presence: true,
    },
    lastname: {
      presence: true,
    },
    phone: {
      presence: true,
    },
    status: {
      presence: true,
      validateStatusChange: {
        licence: data.licence,
        message: 'can not make a change due to the licence is expired',
      },
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
  validate.validators.validateStatusChange = validateStatusChange;
  try {
    await validate.async(data, rules, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

function getQueryData({
  limit = 10, page = 1, s = '',
}) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);

  const last3Months = moment().subtract(3, 'months').toDate();
  const conditions = {
    roles: User.ROLE_DRIVER,
    status: User.STATUS_ACTIVE,
    'driverProfile.lastJobAt': { $lt: last3Months },
  };
  if (s) {
    conditions.$or = [
      { uId: new RegExp(escapeRegExp(s), 'i') },
      { fullname: new RegExp(escapeRegExp(s), 'i') },
      { email: new RegExp(escapeRegExp(s), 'i') },
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
  validateDriverData,
  getQueryData,
};
