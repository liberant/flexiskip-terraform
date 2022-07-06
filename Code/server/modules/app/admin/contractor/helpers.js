const validate = require('validate.js');
const User = require('../../models/user');

/**
 * Validate submitted data when updating contractor
 * @param {Object} data
 */
function validateUpdateForm(data) {
  const constraints = {
    'company.abn': {
      presence: { allowEmpty: false },
      length: { is: 11 },
    },
    'company.name': {
      presence: { allowEmpty: false },
    },
    'company.address': {
      presence: { allowEmpty: false },
    },
    'company.phone': {
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

  return validate(data, constraints, { format: 'grouped' });
}

module.exports = {
  validateUpdateForm,
};
