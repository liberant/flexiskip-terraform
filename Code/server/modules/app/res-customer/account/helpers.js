const validate = require('validate.js');

/**
 * validate and filter input from profile form
 * @param  object form input
 * @return object list of validation errors or null
 */
function validateProfileData(data) {
  const constraints = {
    firstname: {
      presence: { allowEmpty: false },
    },
    lastname: {
      presence: { allowEmpty: false },
    },
  };

  return validate(data, constraints);
}

module.exports = {
  validateProfileData,
};
