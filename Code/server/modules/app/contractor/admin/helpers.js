const validate = require('validate.js');
const User = require('../../models/user');
const EmailHelper = require('../../helpers/email');
const { escapeRegExp } = require('../../../common/helpers');

/**
 * Convert query params to mongodb query data
 */
function getQueryData({ limit = 10, page = 1, s = '' }, user) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    'contractorProfile.organisation': user.contractorProfile.organisation,
    roles: User.ROLE_CONTRACTOR,
  };

  if (s) {
    conditions.$or = [
      { uId: new RegExp(escapeRegExp(s), 'i') },
      { firstname: new RegExp(escapeRegExp(s), 'i') },
      { lastname: new RegExp(escapeRegExp(s), 'i') },
      { email: new RegExp(escapeRegExp(s), 'i') },
      { phone: new RegExp(escapeRegExp(s), 'i') },
    ];
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

/**
 * Validate contractor login data
 * @param {Object} data
 */
async function validateContractorData(data, user) {
  validate.Promise = global.Promise;
  validate.validators.unique = async (value, { except = '' }) => {
    if (value === except) {
      return Promise.resolve();
    }
    const item = await User.findOne({ email: value });
    return !item
      ? Promise.resolve()
      : Promise.resolve('is already existed.');
  };

  let errors;
  const rules = {
    email: {
      presence: true,
      email: true,
      unique: { except: user._id ? user.email : '' },
    },
    firstname: {
      presence: true,
    },
    lastname: {
      presence: true,
    },
    phone: {
      presence: true,
    },
  };

  try {
    await validate.async(data, rules, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

async function saveContractor(data, user) {
  const u = user;
  const contractorProfile = u.toObject().contractorProfile || {};
  const isNew = !u._id;

  // set user data
  u.email = data.email;
  u.roles = [User.ROLE_CONTRACTOR];
  u.status = data.status;
  u.firstname = data.firstname;
  u.lastname = data.lastname;
  u.phone = data.phone;

  // set contractor profile data
  u.contractorProfile = {
    ...contractorProfile,
    organisation: data.orgId,
    isPrimary: data.isPrimary,
  };

  u.contactMethod = User.CONTACT_METHOD_WEB;

  // turn off other primary contact
  if (data.isPrimary) {
    await User.findOneAndUpdate({
      'contractorProfile.isPrimary': true,
      'contractorProfile.organisation': data.orgId,
      roles: User.ROLE_CONTRACTOR,
    }, {
      $set: { 'contractorProfile.isPrimary': false },
    });
  }

  // save driver information if user is also a driver
  if (data.isDriver) {
    const driverProfile = u.toObject().driverProfile || {};
    u.driverProfile = {
      ...driverProfile,
      organisation: data.orgId,
    };
    u.firstname = data.firstname;
    u.lastname = data.lastname;
    u.phone = data.phone;
    u.roles = [User.ROLE_CONTRACTOR, User.ROLE_DRIVER];
  } else {
    u.roles = [User.ROLE_CONTRACTOR];
  }

  // send onboarding email for new user
  if (isNew) {
    await EmailHelper.sendWelcomeEmailToContractor(u);
  }
  return u.save();
}

function validateStatusData(data) {
  const rules = {
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [User.STATUS_ACTIVE, User.STATUS_INACTIVE,
          User.STATUS_REMOVED, User.STATUS_SUSPENDED],
        message: 'must be in [Active, Inactive, Suspended or Removed]',
      },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

module.exports = {
  validateContractorData,
  saveContractor,
  getQueryData,
  validateStatusData,
};

