const validate = require('validate.js');
const Review = require('../../models/review');
const { escapeRegExp } = require('../../../common/helpers');

function getQueryData({ limit = 10, page = 1, s }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const match = {
    point: { $lt: 3 },
  };
  if (s) {
    match.$or = [
      { 'collectionRequest.code': new RegExp(escapeRegExp(s), 'i') },
      { 'reviewer.fullname': new RegExp(escapeRegExp(s), 'i') },
      { 'reviewee.fullname': new RegExp(escapeRegExp(s), 'i') },
    ];
  }

  const pipelines = [
    {
      $lookup: {
        from: 'collectionRequests',
        localField: 'collectionRequest',
        foreignField: '_id',
        as: 'collectionRequest',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'reviewer',
        foreignField: '_id',
        as: 'reviewer',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'reviewee',
        foreignField: '_id',
        as: 'reviewee',
      },
    },
    {
      $match: match,
    },
    { $unwind: '$collectionRequest' },
    { $unwind: '$reviewer' },
    { $unwind: '$reviewee' },
  ];

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    pipelines,
    limit: limit2,
    page,
    offset,
  };
}

function validateStatus(data) {
  const rules = {
    status: {
      presence: true,
      inclusion: {
        within: [
          Review.STATUS_REPORTED,
          Review.STATUS_ACTIONED,
          Review.STATUS_RESOLVED,
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

module.exports = {
  getQueryData,
  validateStatus,
};
