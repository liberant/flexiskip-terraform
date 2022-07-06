const validate = require('validate.js');
const Vehicle = require('../../models/vehicle');

function validateUpdateVehicleForm(data) {
  const rules = {
    model: {
      presence: { allowEmpty: false },
    },
    regNo: {
      presence: { allowEmpty: false },
    },
    wasteTypes: {
      presence: { allowEmpty: false, message: '^Product Types can\'t not be blank' },
    },
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [Vehicle.STATUS_PENDING, Vehicle.STATUS_ACTIVE,
          Vehicle.STATUS_UNAVAILABLE, Vehicle.STATUS_REMOVED],
        message: 'must be in [Pending, Active, Unavailable, Removed]',
      },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

module.exports = {
  validateUpdateVehicleForm,
};
