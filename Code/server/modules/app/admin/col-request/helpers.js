const validate = require('validate.js');
const moment = require('moment');
const CollectionRequest = require('../../models/collection-request');
const { escapeRegExp } = require('../../../common/helpers');

function getQueryData({ limit = 10, page = 1, s, startDate, endDate, exportAll }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const match = {
    status: { $ne: CollectionRequest.STATUS_DRAFT },
  };



  if (s) {
    match.$or = [
      { code: new RegExp(`^${escapeRegExp(s)}`, 'i') },
      { code: new RegExp(`^${escapeRegExp(`cr${s}`)}`, 'i') },
      { 'driver.fullname': new RegExp(escapeRegExp(s), 'i') },
    ];
  }

  if (startDate) {
    match.createdAt = match.createdAt || {};
    match.createdAt.$gt = moment.utc(startDate).toDate();
  }

  if (endDate) {
    match.createdAt = match.createdAt || {};
    match.createdAt.$lt = moment.utc(endDate).toDate();
  }

  // calculate offset
  const offset = (page2 - 1) * limit2;

  let queryFacet = {
    total: [{ $count: "count" }],
    data: [
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: limit2 },
    ],
  }

  if (exportAll) {
    queryFacet = {
      total: [{ $count: "count" }],
      data: [
        { $sort: { createdAt: -1 } },
      ],
    }
  }

  const pipelines = [
    {
      $lookup: {
        from: 'users',
        localField: 'driver',
        foreignField: '_id',
        as: 'driver',
      },

    },
    {
      $lookup: {
        from: 'organisations',
        localField: 'contractorOrganisation',
        foreignField: '_id',
        as: 'contractorOrganisation',
      },
    },
    {
      $match: match,
    },
    {
      $unwind: {
        path: '$driver',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$contractorOrganisation',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $facet: queryFacet
    }
  ];
  return {
    pipelines,
    limit: limit2,
    page,
    offset,
  };
}

function validateUpdateForm(data, colReq) {
  // function that perform password validation
  validate.validators.nextStatus = (newStatus) => {
    // if no change, return no errors
    if (colReq.status === newStatus) {
      return undefined;
    }

    // only allow status change from Accepted to Requested
    if (colReq.status !== (CollectionRequest.STATUS_ACCEPTED || CollectionRequest.STATUS_FUTILED)
      || newStatus !== CollectionRequest.STATUS_REQUESTED) {
      return 'is not allowed to change';
    }

    return undefined;
  };

  const rules = {
    status: {
      presence: { allowEmpty: false },
      nextStatus: true,
    },
    collectionAddress: {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

module.exports = {
  getQueryData,
  validateUpdateForm,
};
