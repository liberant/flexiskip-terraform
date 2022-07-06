const moment = require('moment');
const validate = require('validate.js');
const User = require('../../models/user');
const { escapeRegExp } = require('../../../common/helpers');

function getQueryData({ limit = 10, page = 1, s = '' }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    roles: User.ROLE_DRIVER,
  };
  if (s) {
    conditions.$or = [
      { uId: new RegExp(escapeRegExp(s), 'i') },
      { firstname: new RegExp(escapeRegExp(s), 'i') },
      { lastname: new RegExp(escapeRegExp(s), 'i') },
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

function validateStatusData(data) {
  const rules = {
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [User.STATUS_ACTIVE, User.STATUS_INACTIVE,
          User.STATUS_REMOVED, User.STATUS_SUSPENDED],
        message: 'must be in [Active, Inactive, Suspended or Removed]',
      },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

module.exports = {
  getQueryData,
  validateStatusData,
};
