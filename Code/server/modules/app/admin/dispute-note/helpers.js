const validate = require('validate.js');
const Dispute = require('../../models/dispute');

function getQueryData({ limit = 10, page = 1 }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
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

function validateStatus(data) {
  const rules = {
    status: {
      presence: true,
      inclusion: {
        within: [
          Dispute.STATUS_REPORTED,
          Dispute.STATUS_ACTIONED,
          Dispute.STATUS_RESOLVED,
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

function validateNoteData(data) {
  const rules = {
    content: {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

module.exports = {
  getQueryData,
  validateStatus,
  validateNoteData,
};
