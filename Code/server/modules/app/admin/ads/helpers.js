const validate = require('validate.js');
const Advertisement = require('../../models/advertisement');
const { escapeRegExp } = require('../../../common/helpers');

function getQueryData({ limit = 10, page = 1, s }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
  };
  if (s) {
    conditions.title = new RegExp(escapeRegExp(s), 'i');
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

/**
 * Validate form data of Advertisement
 */
function validateFormData(data) {
  const rules = {
    title: {
      presence: { allowEmpty: false },
    },
    section: {
      presence: { allowEmpty: false },
    },
    image: {
      presence: { allowEmpty: false },
    },
    content: {
      presence: { allowEmpty: false },
    },
    startDate: {
      presence: { allowEmpty: false },
    },
    endDate: {
      presence: { allowEmpty: false },
    },
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [
          Advertisement.STATUS_REMOVED,
          Advertisement.STATUS_DRAFT,
          Advertisement.STATUS_LIVE,
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

function validateStatusData(data) {
  const rules = {
    status: {
      presence: true,
      inclusion: {
        within: [
          Advertisement.STATUS_REMOVED,
          Advertisement.STATUS_DRAFT,
          Advertisement.STATUS_LIVE,
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
  validateStatusData,
};
