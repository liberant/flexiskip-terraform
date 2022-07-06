import validate from 'validate.js';

export default function validateLoginData(data) {
  const constraints = {
    email: {
      presence: { message: '^Username can\'t be blank', allowEmpty: false },
    },
  };
  return validate(data, constraints, { format: 'grouped' }) || {};
}
