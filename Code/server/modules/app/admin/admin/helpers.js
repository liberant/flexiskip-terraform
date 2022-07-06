const validate = require('validate.js');
const User = require('../../models/user');

/**
 * Validate contractor login data
 * @param {Object} data
 */
async function validateFormData(data, type = null) {
  validate.Promise = global.Promise;

  validate.validators.emailNotExists = async (value) => {
    const user = await User.findOne({
      email: value,
    });
    return !user
      ? Promise.resolve()
      : Promise.resolve('is already existed.');
  };
  let errors;
  const rules = {
    email: !type ? {
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
    role: {
      presence: { allowEmpty: false },
    },
    status: type ? {
      presence: true,
      inclusion: {
        within: [
          User.STATUS_ACTIVE,
          User.STATUS_INACTIVE,
          User.STATUS_UNAVAILABLE,
          User.STATUS_SUSPENDED,
          User.STATUS_PENDING,
        ],
        message: 'is not allowed',
      },
    } : null,
  };
  try {
    await validate.async(data, rules, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

module.exports = {
  validateFormData,
};
