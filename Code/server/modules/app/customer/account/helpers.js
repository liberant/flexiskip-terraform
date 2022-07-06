const validate = require('validate.js');
const User = require('../../models/user');
const Organisation = require('../../models/organisation');
const { getCouncilByAddress } = require('../../helpers');
const {
  createCustomer,
  updateCustomerCard,
  removeAllCardsOfCustomer,
} = require('../../../common/payment');
const {
  filterObjectKeys,
  passwordStrength,
} = require('../../../common/helpers');
const EmailHelper = require('../../helpers/email');

function validateLoginData(data) {
  let constraints = {
    loginId: {
      presence: { message: '^Email can\'t be blank' },
    },
    password: {
      presence: true,
    },
  };
  if (data.socialType) {
    constraints = {
      socialType: {
        presence: { message: "^Social method can't be blank" },
      },
      accessToken: {
        presence: { message: "^Access token can't be blank" },
      },
    };
  }
  return validate(data, constraints, { format: 'grouped' });
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

  validate.validators.passwordStrength = passwordStrength;

  let errors;
  let constraints = {
    email: {
      presence: { allowEmpty: false },
      email: true,
      emailNotExists: true,
    },
    password: {
      presence: { allowEmpty: false },
      passwordStrength: true,
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
    customerType: {
      presence: { allowEmpty: false },
      inclusion: {
        within: ['Residential', 'Business'],
        message: 'must be Residential or Business',
      },
    },
  };

  if (data.customerType === 'Business') {
    constraints = {
      ...constraints,
      abn: {
        presence: { allowEmpty: false },
        length: { is: 11 },
      },
      businessName: {
        presence: { allowEmpty: false },
      },
    };
  }

  // only validate specific fields
  if (Array.isArray(fields)) {
    constraints = filterObjectKeys(constraints, fields);
  }

  try {
    await validate.async(data, constraints, { format: 'grouped' });
    const connectedUserConstraints = {
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
    };
    if (data.customerType === 'Business') {
      await Promise.all(data.users.map(user => validate.async(user, connectedUserConstraints, { format: 'grouped' })));
    }
  } catch (err) {
    errors = err;
  }
  return errors;
}

async function saveResidentialCustomer(data) {
  let customer = await createCustomer(data.email);
  let cardLast4Digits = '';
  if (data.cardId) {
    customer = await updateCustomerCard(customer.id, data.cardId);
    cardLast4Digits = customer.sources.data[0].last4;
  }
  const council = await getCouncilByAddress(data.address);
  const user = new User({
    email: data.email,
    status: User.STATUS_ACTIVE,
    roles: User.ROLE_RES_CUSTOMER,
    council: council ? council._id : undefined,
    firstname: data.firstname,
    lastname: data.lastname,
    phone: data.phone,
    residentialCustomerProfile: {
      address: data.address,
      payment: {
        stripeCustomerId: customer.id,
        cardLast4Digits,
      },
    },
  });
  user.setPassword(data.password);
  await user.save();
  return user;
}

function saveConnectedUsers(data, org, councilId) {
  const { users } = data;
  if (!users || !Array.isArray(users)) {
    return false;
  }

  const promises = [];
  users.forEach(async (item) => {
    const user = new User({
      email: item.email,
      status: User.STATUS_ACTIVE,
      roles: User.ROLE_BUS_CUSTOMER,
      council: councilId,
      firstname: item.firstname,
      lastname: item.lastname,
      phone: item.phone,
      businessCustomerProfile: {
        isPrimary: false,
        organisation: org._id,
      },
    });
    await EmailHelper.sendWelcomeEmailToBusinessCustomer(user);
    promises.push(user.save());
  });
  return Promise.all(promises);
}

async function saveBusinessCustomer(data) {
  // save organisation
  let customer = await createCustomer(data.businessEmail, data.businessName);
  let payment = {
    stripeCustomerId: customer.id,
    cardLast4Digits: '',
    cardBrand: '',
  };

  // update customer payment card if submitted
  if (data.cardId) {
    customer = await updateCustomerCard(customer.id, data.cardId);
    payment = {
      stripeCustomerId: customer.id,
      cardLast4Digits: customer.sources.data[0].last4,
      cardBrand: customer.sources.data[0].brand,
    };
  }

  const org = new Organisation({
    abn: data.abn,
    name: data.businessName,
    email: data.businessEmail,
    address: data.address,
    payment,
  });
  await org.save();

  // save primary contact user
  const council = await getCouncilByAddress(org.address);
  const councilId = council ? council._id : undefined;
  const user = new User({
    email: data.email,
    status: User.STATUS_ACTIVE,
    roles: User.ROLE_BUS_CUSTOMER,
    council: councilId,
    firstname: data.firstname,
    lastname: data.lastname,
    phone: data.phone,
    businessCustomerProfile: {
      position: data.position,
      isPrimary: true,
      organisation: org._id,
    },
  });
  user.setPassword(data.password);
  await user.save();

  await saveConnectedUsers(data, org, councilId);
  return user;
}

function validatePaymentData(data) {
  const constraints = {
    cardId: {
      presence: true,
    },
  };
  return validate(data, constraints, { format: 'grouped' });
}

function getUserStripeCustomerId(user) {
  let customerId;
  if (user.can(User.ROLE_RES_CUSTOMER)) {
    customerId = user.residentialCustomerProfile.payment.stripeCustomerId;
  } else if (user.can(User.ROLE_BUS_CUSTOMER)) {
    const org = user.businessCustomerProfile.organisation;
    customerId = org.payment.stripeCustomerId;
  }
  return customerId;
}

async function updateUserCardDigits(user, digits) {
  try {
    const u2 = user;
    if (user.can(User.ROLE_RES_CUSTOMER)) {
      u2.residentialCustomerProfile.payment.cardLast4Digits = digits;
      await user.save();
    } else if (user.can(User.ROLE_BUS_CUSTOMER)) {
      const org = user.businessCustomerProfile.organisation;
      org.payment.cardLast4Digits = digits;
      await org.save();
    }
  } catch (error) {
    throw error;
  }
}

async function updateCard(user, cardId) {
  try {
    await user.populate('businessCustomerProfile.organisation').execPopulate();
    const customerId = getUserStripeCustomerId(user);
    if (!customerId) return false;

    if (cardId) {
      const customer = await updateCustomerCard(customerId, cardId);
      await updateUserCardDigits(user, customer.sources.data[0].last4);
    } else {
      await removeAllCardsOfCustomer(customerId);
      await updateUserCardDigits(user, '');
    }
    await user.populate('businessCustomerProfile.organisation').execPopulate();

    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  validateRegistrationData,
  saveResidentialCustomer,
  saveBusinessCustomer,
  validateLoginData,
  validatePaymentData,
  updateCard,
};
