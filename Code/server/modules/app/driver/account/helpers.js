const validate = require('validate.js');
const User = require('../../models/user');
const { filterObjectKeys } = require('../../../common/helpers');

function validateLoginData(data) {
  const constraints = {
    loginId: {
      presence: { message: '^Username can\'t be blank' },
    },
    password: {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, constraints, { format: 'grouped' });
}

async function checkVehicleAvailable(vehicleId, { driver }) {
  // if no vehicle submitted, skip validation
  if (!vehicleId) {
    return Promise.resolve();
  }

  // skip if vehicle is the current driver's vehicle
  if (driver.driverProfile.vehicle &&
    driver.driverProfile.vehicle._id.toString() === vehicleId.toString()) {
    return Promise.resolve();
  }

  // check if vehicle has been assigned to other drivers
  const assignedVehicles = await User.findOne({
    roles: User.ROLE_DRIVER,
    'driverProfile.vehicle': vehicleId,
  });
  return assignedVehicles
    ? Promise.resolve('is not available.')
    : Promise.resolve();
}

/**
 * validate and filter input from profile form
 * @param  object form input
 * @param  User mongoose user model
 * @return object list of validation errors or null
 */
async function validateProfileData(data, driver) {
  validate.Promise = global.Promise;
  validate.validators.available = checkVehicleAvailable;
  // validation constraints
  const constraints = {
    firstname: {
      presence: { allowEmpty: false },
    },
    lastname: {
      presence: { allowEmpty: false },
    },
    phone: {
      presence: true,
      length: { is: 10 },
    },
    status: {
      presence: true,
      inclusion: {
        within: [User.STATUS_ACTIVE, User.STATUS_UNAVAILABLE],
        message: 'is not allowed',
      },
    },
    vehicle: {
      available: { driver },
    },
  };
  try {
    await validate.async(data, constraints, { format: 'grouped' });
  } catch (errors) {
    return errors;
  }
  return undefined;
}

async function validateRegistrationData(data, fields) {
  validate.Promise = global.Promise;

  validate.validators.emailNotExists = async (value) => {
    const user = await User.findOne({
      email: value,
    });
    return !user
      ? Promise.resolve()
      : Promise.resolve('is already registered.');
  };

  let errors;
  let constraints = {
    email: {
      presence: { allowEmpty: false },
      email: true,
      emailNotExists: true,
    },
    password: {
      presence: { allowEmpty: false },
    },
    customerType: {
      presence: { allowEmpty: false },
    },
    firstname: {
      presence: { allowEmpty: false },
    },
    lastname: {
      presence: { allowEmpty: false },
    },
    phone: {
      presence: { allowEmpty: false },
      length: { is: 10 },
    },
    address: {
      presence: { allowEmpty: false },
    },
  };

  // only validate specific fields
  if (Array.isArray(fields)) {
    constraints = filterObjectKeys(constraints, fields);
  }

  try {
    await validate.async(data, constraints, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

function validateUpdateStatusData(data, user) {
  validate.validators.currentStatus = (value) => {
    if (value === User.STATUS_ACTIVE && user.status !== User.STATUS_UNAVAILABLE) {
      return 'is forbidden to change';
    }
    if ([User.STATUS_UNAVAILABLE, User.STATUS_INACTIVE].includes(value)
      && user.status !== User.STATUS_ACTIVE) {
      return 'is forbidden to change';
    }
    return undefined;
  };

  const constraints = {
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [User.STATUS_ACTIVE, User.STATUS_UNAVAILABLE, User.STATUS_INACTIVE],
        message: 'must be Active or Unavailable',
      },
      currentStatus: true,
    },
  };

  return validate(data, constraints);
}

module.exports = {
  validateLoginData,
  validateProfileData,
  validateRegistrationData,
  validateUpdateStatusData,
};
