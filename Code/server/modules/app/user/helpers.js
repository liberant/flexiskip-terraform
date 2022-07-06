const validate = require('validate.js');
const { verifyToken, passwordStrength } = require('../../common/helpers');
const User = require('../models/user');

// validate required fields on forgot password form
async function validateForgotPwdData(data) {
  validate.Promise = global.Promise;
  validate.validators.emailExists = async (value) => {
    const user = await User.findOne({
      email: value,
    });
    if (!user || (data.userType && !user.can(data.userType))) {
      return Promise.resolve('does not exist or account is not enabled');
    }

    return undefined;
  };

  const rules = {
    email: {
      presence: { allowEmpty: false },
      email: true,
      emailExists: true,
    },
  };

  let errors;
  try {
    await validate.async(data, rules, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }

  return errors;
}

/**
 * Validate change password data
 *
 * @param {Object} data
 */
async function validateResetPwdData(data) {
  validate.Promise = global.Promise;
  validate.validators.passwordStrength = passwordStrength;
  validate.validators.userToken = async (value) => {
    const decoded = verifyToken(value);
    if (!decoded) return Promise.resolve('invalid');

    const user = await User.findOne({
      _id: decoded.userId,
    });
    return user
      ? Promise.resolve()
      : Promise.resolve('^No such user in the system. Please make sure that you installed the right app.');
  };

  const constraints = {
    token: {
      presence: { allowEmpty: false },
      userToken: true,
    },
    password: {
      presence: { allowEmpty: false },
      passwordStrength: true,
    },
  };

  let errors;
  try {
    await validate.async(data, constraints, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

/**
 * Validate and filter input from profile form
 *
 * @param  object form input
 * @param  User mongoose user model
 * @return object list of validation errors or null
 */
function validateChangePasswordData(data, user) {
  // function that perform password validation
  validate.validators.checkPassword = value =>
    (value && !user.checkPassword(value) ? 'is wrong' : null);

  validate.validators.passwordStrength = passwordStrength;

  // validation constraints
  const constraints = {
    // only validate when new password is setted
    currentPassword: {
      presence: { allowEmpty: false },
      checkPassword: true,
    },
    newPassword: {
      presence: { allowEmpty: false },
      passwordStrength: true,
    },
  };

  return validate(data, constraints);
}

module.exports = {
  validateForgotPwdData,
  validateResetPwdData,
  validateChangePasswordData,
};
