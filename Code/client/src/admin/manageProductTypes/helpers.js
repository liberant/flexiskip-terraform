import validate from 'validate.js';

export default function validateProfileData(data) {
  const constraints = {
    username: {
      presence: true,
      length: { minimum: 3, maximum: 30 },
      format: {
        pattern: '[a-z0-9]+',
        flags: 'i',
        message: 'can only contain alphabet and numeric characters',
      },
    },
    email: {
      presence: true,
      email: true,
    },
    password(value /* , attributes, attributeName, options, constraints */) {
      // only validate when value is not empty
      return value ? {
        length: { minimum: 6, maximum: 30 },
      } : false;
    },
    repeatPassword(value, attributes /* , attributeName, options, constraints */) {
      // only validate when password is not empty
      return attributes.password ? {
        presence: true,
        equality: 'password',
      } : false;
    },
    currentPassword(value, attributes /* , attributeName, options, constraints */) {
      // only validate when password is not empty
      return attributes.password ? {
        presence: true,
      } : false;
    },
  };

  return validate(data, constraints);
}
