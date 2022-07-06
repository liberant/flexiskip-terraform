const validate = require('validate.js');
const moment = require('moment');
const { escapeRegExp } = require('../../../common/helpers');

function getQueryData({
  limit = 10,
  page = 1,
  sort = 'createdAt',
  dir = 'desc',
  startDate,
  endDate,
  s,
}) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    status: { $ne: 'Draft' },
  };

  if (startDate) {
    conditions.createdAt = conditions.createdAt || {};
    conditions.createdAt.$gt = moment.utc(startDate).toDate();
  }

  if (endDate) {
    conditions.createdAt = conditions.createdAt || {};
    conditions.createdAt.$lt = moment.utc(endDate).toDate();
  }

  if (s) {
    conditions.$or = [
      { 'customer.fullname': new RegExp(escapeRegExp(s), 'i') },
      { code: new RegExp(escapeRegExp(s), 'i') },
    ];
  }

  const pipelines = [
    {
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
    },
  ];

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    pipelines,
    limit: limit2,
    page,
    offset,
    sort: { [sort]: dir === 'desc' ? -1 : 1 },
  };
}

function validateParams(data) {
  const rules = {
    type: {
      presence: true,
      inclusion: {
        within: [
          'collection',
          'bin',
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

module.exports = {
  getQueryData,
  validateParams,
};
