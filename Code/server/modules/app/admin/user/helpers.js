const mongoose = require('mongoose');
const validate = require('validate.js');
const User = require('../../models/user');
const { escapeRegExp } = require('../../../common/helpers');
const { getAdminRoles } = require('../account/helpers');

const { ObjectId } = mongoose.Types;

function validateStatusData(data) {
  const rules = {
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [User.STATUS_ACTIVE, User.STATUS_INACTIVE,
          User.STATUS_REMOVED, User.STATUS_SUSPENDED],
        message: 'must be in [Active, Inactive, Removed, Suspended]',
      },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

async function getQueryData({
  limit = 10, page = 1, type, s = '', isPrimary = false, prefix
}) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {};
  if (type) {
    const adminRoles = await getAdminRoles();
    conditions.roles = type === 'admin' ?
      { $in: adminRoles } :
      { $in: type.split(',') };
  }
  if (s) {
    conditions.$or = [
      { uId: new RegExp(escapeRegExp(s), 'i') },
      { firstname: new RegExp(escapeRegExp(s), 'i') },
      { lastname: new RegExp(escapeRegExp(s), 'i') },
      { phone: new RegExp(escapeRegExp(s), 'i') },
      { email: new RegExp(escapeRegExp(s), 'i') },
      { fullname: new RegExp(escapeRegExp(s), 'i') },
      { 'residentialCustomerProfile.address': new RegExp(escapeRegExp(s), 'i') },
    ];
  }
  if (isPrimary) {
    conditions['businessCustomerProfile.isPrimary'] = true;
  }

  if (prefix) conditions.prefix = prefix;

  const offset = (page2 - 1) * limit2;
  return {
    conditions,
    limit: limit2,
    page,
    offset,
  };
}

/**
 * validate user before save
 * @param {*} data
 */
async function validateUpdateUserData(data, user) {
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
      unique: { except: user.email },
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

function getQueryDataForUser({
  limit = 10,
  page = 1,
  sort = 'createdAt',
  dir = 'desc',
  s,
}, userId) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    status: {
      $ne: 'Draft',
    },
    'customer._id': ObjectId(userId),
  };

  if (s) {
    conditions.$or = [{
      'customer.fullname': new RegExp(escapeRegExp(s), 'i'),
    },
    {
      code: new RegExp(escapeRegExp(s), 'i'),
    }];
  }

  const pipelines = [{
    $lookup: {
      from: 'bins',
      localField: 'bins',
      foreignField: '_id',
      as: 'bins',
    },
  },
  {
    // for bin request
    $lookup: {
      from: 'users',
      localField: 'customer',
      foreignField: '_id',
      as: 'customer',
    },
  },
  {
    // for collection request
    $lookup: {
      from: 'users',
      localField: 'driver',
      foreignField: '_id',
      as: 'driver',
    },
  },
  {
    $match: conditions,
  },
  {
    // for bin request
    $unwind: {
      path: '$customer',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    // for collection request
    $unwind: {
      path: '$driver',
      preserveNullAndEmptyArrays: true,
    },
  }];

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    pipelines,
    limit: limit2,
    page,
    offset,
    sort: {
      [sort]: dir === 'desc' ? -1 : 1,
    },
  };
}

function getCollectionRequests(collectionRequests) {
  const result = collectionRequests.map((collectionRequest) => {
    collectionRequest.requestType = 'collectionRequest';
    return collectionRequest;
  });
  return result;
}

function getBinRequests(binRequests) {
  const result = binRequests.map((binRequest) => {
    binRequest.requestType = 'binRequest';
    return binRequest;
  });
  return result;
}

function combineRequests(binRequests, collectionRequests, {
  sort = 'createdAt',
  dir = 'desc',
}) {
  const resultBinRequests = getBinRequests(binRequests);
  const resultCollectionRequests = getCollectionRequests(collectionRequests);
  const requests = resultBinRequests.concat(resultCollectionRequests);

  if (sort === 'createdAt') {
    if (dir === 'desc') {
      return requests.sort((a, b) => new Date(b[sort]) - new Date(a[sort]));
    }
    return requests.sort((a, b) => new Date(a[sort]) - new Date(b[sort]));
  }
  if (dir === 'desc') {
    return requests.sort((a, b) => b[sort] - a[sort]);
  }
  return requests.sort((a, b) => a[sort] - b[sort]);
}


module.exports = {
  validateStatusData,
  getQueryData,
  validateUpdateUserData,
  getQueryDataForUser,
  combineRequests,
};
