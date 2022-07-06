const validate = require('validate.js');
const User = require('../../models/user');
const EmailHelper = require('../../helpers/email');
const { getCouncilByAddress } = require('../../helpers');

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
    businessName: {
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

  return validate(data, constraints);
}

async function createConnectedUser(data, org) {
  const user = new User({
    email: data.email,
    status: User.STATUS_ACTIVE,
    roles: User.ROLE_BUS_CUSTOMER,
    firstname: data.firstname,
    lastname: data.lastname,
    phone: data.phone,
    businessCustomerProfile: {
      isPrimary: data.isPrimary,
      organisation: org._id,
      position: data.position,
    },
  });
  await user.save();
  await EmailHelper.sendWelcomeEmailToBusinessCustomer(user);
  return user;
}

async function updateConnectedUser(userData, org) {
  const user = await User.findOne({
    _id: userData._id,
    'businessCustomerProfile.organisation': org._id,
  });
  if (!user) {
    throw new Error('Failed when updating user. User not found.');
  }
  user.firstname = userData.firstname;
  user.lastname = userData.lastname;
  user.phone = userData.phone;
  user.businessCustomerProfile.postion = userData.position;
  user.businessCustomerProfile.isPrimary = userData.isPrimary;
  await user.save();
  return user;
}

async function deleteConnectedUser(userData) {
  const user = await User.findById(userData._id);
  if (!user) {
    throw new Error('Failed when deleting user. User not found.');
  }
  user.status = User.STATUS_REMOVED;
  user.deletedAt = Date.now();
  await user.save();
  return user;
}

async function saveConnectedUsers(users, org) {
  // turn off primary contact for all users
  await User.updateMany({
    roles: User.ROLE_BUS_CUSTOMER,
    'businessCustomerProfile.organisation': org._id,
  }, {
    $set: { 'businessCustomerProfile.isPrimary': false },
  });

  // save users seperately
  await Promise.all(users.map((userData) => {
    switch (userData.action) {
      case 'add':
        return createConnectedUser(userData, org);

      case 'update':
        return updateConnectedUser(userData, org);

      case 'delete':
        return deleteConnectedUser(userData);

      default:
        return Promise.resolve();
    }
  }));
}

async function updateUserProfile(usr, data) {
  const user = usr;
  try {
    // update user
    user.avatar = data.avatar;
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    user.phone = data.phone;
    user.businessCustomerProfile = {
      ...user.businessCustomerProfile,
      receiveInvoiceEmail: data.receiveInvoiceEmail,
    };
    await user.save();

    // only allow primary contact user to update organisation & connected users
    if (!user.businessCustomerProfile.isPrimary) {
      return false;
    }

    // update organisation
    await user.populate('businessCustomerProfile.organisation').execPopulate();
    const org = user.businessCustomerProfile.organisation;
    org.name = data.businessName;
    org.address = data.address;
    await org.save();

    // update connected users
    if (Array.isArray(data.users)) {
      await saveConnectedUsers(data.users, org);
    }

    // update user's council after changing address
    const council = await getCouncilByAddress(org.address);
    await User.updateMany(
      { 'businessCustomerProfile.organisation': org._id },
      { $set: { council: council ? council._id : undefined } },
    );

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * validate and filter input from business admin customer form
 * @param  object form input
 * @return object list of validation errors or null
 */
async function validateCustomerData(data) {
  validate.Promise = global.Promise;

  validate.validators.emailNotExists = async (value) => {
    const user = await User.findOne({
      email: value.toLowerCase(),
    });
    return !user
      ? Promise.resolve()
      : Promise.resolve('is already registered.');
  };

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
    position: {
      presence: { allowEmpty: false },
    },
    phone: {
      presence: { allowEmpty: false },
      length: { is: 10 },
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

module.exports = {
  validateProfileData,
  updateUserProfile,
  validateCustomerData,
};
