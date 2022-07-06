const validate = require('validate.js');
const Vehicle = require('../../models/vehicle');
const { escapeRegExp } = require('../../../common/helpers');

// validate update profile
function validateAddVehicleForm(data) {
  const rules = {
    regNo: {
      presence: { allowEmpty: false },
    },
    wasteTypes: {
      presence: { allowEmpty: false },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

function validateUpdateVehicleForm(data) {
  const rules = {
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

function getQueryData({ limit = 10, page = 1, s }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    status: {
      $ne: Vehicle.STATUS_REMOVED,
    },
  };
  if (s) {
    const searchByCode = {
      code: new RegExp(escapeRegExp(s), 'i'),
    };
    const searchByRegNo = {
      regNo: new RegExp(escapeRegExp(s), 'i'),
    };
    const searchByName = {
      model: new RegExp(escapeRegExp(s), 'i'),
    };
    conditions.$or = [];
    conditions.$or.push(searchByCode);
    conditions.$or.push(searchByRegNo);
    conditions.$or.push(searchByName);
  }

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    conditions,
    limit: limit2,
    page,
    offset,
  };
}

function validateStatusData(data) {
  const rules = {
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
  getQueryData,
  validateAddVehicleForm,
  validateUpdateVehicleForm,
  validateStatusData,
};
