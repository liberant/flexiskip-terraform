const validate = require('validate.js');
const Permission = require('../../models/permission');

/**
 * Validate login data
 *
 * @param {Object} data
 */
function validateLoginData(data) {
  const rules = {
    loginId: {
      presence: { message: '^Username can\'t be blank' },
    },
    password: {
      presence: true,
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

/**
 * validate and filter input from profile form
 * @param  object form input
 * @param  User mongoose user model
 * @return object list of validation errors or null
 */
function validateProfileData(data, user) {
  // function that perform password validation
  validate.validators.checkPassword = (value) => {
    if (value && !user.checkPassword(value)) {
      return 'is wrong';
    }
    return null;
  };

  const constraints = {
    newPassword: {
      presence: { allowEmpty: false },
      length: { minimum: 6, maximum: 256 },
    },
    currentPassword: {
      presence: { allowEmpty: false },
      checkPassword: true,
    },
  };

  return validate(data, constraints);
}

async function getAdminRoles() {
  const items = await Permission.find({
    type: 'role',
    application: 'admin-portal',
  });
  return items.map(item => item.name);
}

module.exports = {
  validateLoginData,
  validateProfileData,
  getAdminRoles,
};
