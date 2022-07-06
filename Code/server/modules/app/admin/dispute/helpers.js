const validate = require('validate.js');
const Dispute = require('../../models/dispute');
const { escapeRegExp } = require('../../../common/helpers');

function getQueryData({ limit = 10, page = 1, s }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const match = {
    // point: { $lt: 3 },
  };
  if (s) {
    match.$or = [
      { 'collectionRequest.code': new RegExp(escapeRegExp(s), 'i') },
      { 'reporter.fullname': new RegExp(escapeRegExp(s), 'i') },
      { 'user.fullname': new RegExp(escapeRegExp(s), 'i') },
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
        localField: 'reporter',
        foreignField: '_id',
        as: 'reporter',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $match: match,
    },
    { $unwind: '$collectionRequest' },
    { $unwind: '$reporter' },
    { $unwind: '$user' },
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
          Dispute.STATUS_REPORTED,
          Dispute.STATUS_ACTIONED,
          Dispute.STATUS_RESOLVED,
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
