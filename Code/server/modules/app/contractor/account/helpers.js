const validate = require('validate.js');
const User = require('../../models/user');
const {
  updateCustomerCard,
  removeAllCardsOfCustomer,
} = require('../../../common/payment');
const { parseAddress } = require('../../../common/shipping');

/**
 * Validate contractor login data
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
 * Validate driver data when submitting registration
 * @param {Object} data
 */
async function validateDriverData(data) {
  validate.Promise = global.Promise;

  validate.validators.emailNotExists = async (value) => {
    const user = await User.findOne({
      email: value,
      roles: User.ROLE_DRIVER,
    });
    return !user
      ? Promise.resolve()
      : Promise.resolve('is already registered.');
  };

  let errors;
  const constraints = {
    email: {
      presence: { allowEmpty: false },
      email: true,
      emailNotExists: true,
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
    'licence.licenceNo': {
      presence: { allowEmpty: false },
    },
    'licence.licenceClass': {
      presence: { allowEmpty: false },
    },
    'licence.licenceType': {
      presence: { allowEmpty: false },
    },
    'licence.dateOfIssued': {
      presence: { allowEmpty: false },
    },
    'licence.expiryDate': {
      presence: { allowEmpty: false },
    },
  };

  try {
    await validate.async(data, constraints, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

/**
 * Validate contractor user profile data
 * @param {Object} data
 */
function validateProfileData(data) {
  const constraints = {
    'company.name': {
      presence: { allowEmpty: false },
    },
    'company.phone': {
      presence: { allowEmpty: false },
      length: { is: 10 },
    },
    'company.address': {
      presence: { allowEmpty: false },
    },
    'contact.firstname': {
      presence: { allowEmpty: false },
    },
    'contact.lastname': {
      presence: { allowEmpty: false },
    },
    'contact.email': {
      presence: { allowEmpty: false },
      email: true,
    },
    'contact.phone': {
      presence: { allowEmpty: false },
      length: { is: 10 },
    },
  };

  return validate(data, constraints);
}

async function updateDriverLocation(org) {
  const drivers = await User.find({
    'driverProfile.organisation': org._id,
  });
  const { location } = await parseAddress(org.address);
  await Promise.all(drivers.map((driver) => {
    const d = driver;
    d.location.coordinates = [location.lng, location.lat];
    return d.save();
  }));
}

async function updateCard(user, cardId) {
  await user.populate('contractorProfile.organisation').execPopulate();
  const org = user.contractorProfile.organisation;
  const customerId = org.payment.stripeCustomerId;
  if (!customerId) return false;

  if (cardId) {
    const customer = await updateCustomerCard(customerId, cardId);
    org.payment.cardLast4Digits = customer.sources.data[0].last4;
    org.payment.cardBrand = customer.sources.data[0].brand;
  } else {
    await removeAllCardsOfCustomer(customerId);
    org.payment.cardLast4Digits = '';
    org.payment.cardBrand = '';
  }
  await org.save();
  return true;
}

function validateStatus(data) {
  const rules = {
    status: {
      presence: true,
      inclusion: {
        within: [
          User.STATUS_ACTIVE,
          User.STATUS_INACTIVE,
          User.STATUS_SUSPENDED,
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

function validateBankData(data) {
  const constraints = {
    name: {
      presence: { allowEmpty: false },
    },
    bsb: {
      presence: { allowEmpty: false },
    },
    accountNo: {
      presence: { allowEmpty: false },
    },
  };

  return validate(data, constraints);
}

module.exports = {
  validateLoginData,
  validateProfileData,
  validateDriverData,
  updateCard,
  validateStatus,
  validateBankData,
  updateDriverLocation,
};
