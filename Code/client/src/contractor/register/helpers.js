import validate from 'validate.js';

export default function validateLoginData(data) {
  const constraints = {
    loginId: {
      presence: { message: '^Username can\'t be blank', allowEmpty: false },
    },
    password: {
      presence: { allowEmpty: false },
    },
    confirmPassword: {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, constraints, { format: 'grouped' }) || {};
}
