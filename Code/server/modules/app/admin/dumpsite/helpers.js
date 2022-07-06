const validate = require('validate.js');
const { escapeRegExp } = require('../../../common/helpers');

function getQueryData({
  limit = 10,
  page = 1,
  s = '',
  sort = '_id',
  dir = 'desc',
  council,
}) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {};
  if (s.length > 0) {
    conditions.$or = [
      { name: new RegExp(escapeRegExp(s), 'i') },
      { code: new RegExp(escapeRegExp(s), 'i') },
      { address: new RegExp(escapeRegExp(s), 'i') },
    ];
  }
  if (council) {
    conditions.council = council;
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

/**
 * Validate form data of Advertisement
 */
function validateFormData(data) {
  const rules = {
    name: {
      presence: { allowEmpty: false },
    },
    address: {
      presence: { allowEmpty: false },
    },
    openDays: {
      presence: { allowEmpty: false },
    },
    charges: {
      presence: {
        allowEmpty: false,
        message: '^Waste types can\' be blank',
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
          'Removed',
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
