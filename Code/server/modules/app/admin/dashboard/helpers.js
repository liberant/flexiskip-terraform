const moment = require('moment');
const BinRequest = require('../../models/bin-request');
const State = require('../../models/state');
const CollectionRequest = require('../../models/collection-request');
const User = require('../../models/user');
const Event = require('../../models/event');
const { getMonthDateRange, escapeRegExp } = require('../../../common/helpers');

/**
 * Get total price of BinRequest or CollectionRequest
 * @param {*} model
 * @param {*} status
 * @param {*} from
 * @param {*} to
 */
async function calcTotal(model, conditions, from, to) {
  const filters = conditions;
  if (from || to) {
    filters.createdAt = {};
  }
  if (from) {
    filters.createdAt.$gt = moment.utc(from).toDate();
  }
  if (to) {
    filters.createdAt.$lt = moment.utc(to).toDate();
  }

  filters.status = CollectionRequest.STATUS_COMPLETED;

  const data = await model.aggregate([
    { $match: filters },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  return data.length > 0 ? data[0].total : 0;
}

// get total revenue from bin request and collection request
async function getTotalRevenue(from, to) {
  const [t1, t2] = await Promise.all([
    calcTotal(BinRequest, { paid: true }, from, to),
    calcTotal(CollectionRequest, { paid: true }, from, to),
  ]);
  return t1 + t2;
}

// get difference between last month and this month revenue
async function getRevenueSinceLastMonth() {
  let d = new Date();
  let range = getMonthDateRange(d);
  const thisMonthRevenue = await getTotalRevenue(range.start, range.end);

  d = moment(d).subtract(1, 'months').toDate();
  range = getMonthDateRange(d);
  const lastMonthRevenue = await getTotalRevenue(range.start, range.end);

  return lastMonthRevenue > 0 ?
    ((thisMonthRevenue - lastMonthRevenue) * 100) / lastMonthRevenue :
    null;
}

async function getBinRequestCount() {
  const result = await BinRequest.countDocuments({
    status: { $nin: [BinRequest.STATUS_DRAFT, BinRequest.STATUS_CANCELLED] },
  });
  return result;
}

async function getPendingBinRequestCount() {
  const result = await BinRequest.countDocuments({
    status: BinRequest.STATUS_PENDING,
  });
  return result;
}

async function getColRequestCount() {
  const result = await CollectionRequest.countDocuments({
    status: { $ne: CollectionRequest.STATUS_DRAFT },
  });
  return result;
}

async function getPendingColRequestCount() {
  const result = await CollectionRequest.countDocuments({
    status: CollectionRequest.STATUS_REQUESTED,
  });
  return result;
}

async function getCustomerCount(from, to) {
  const filters = {
    roles: { $in: [User.ROLE_RES_CUSTOMER, User.ROLE_BUS_CUSTOMER] },
  };
  if (from || to) {
    filters.createdAt = {};
  }
  if (from) {
    filters.createdAt.$gt = from;
  }
  if (to) {
    filters.createdAt.$lt = to;
  }

  const result = await User.countDocuments(filters);
  return result;
}

async function getCustomerSinceLastMonth() {
  let d = new Date();
  let range = getMonthDateRange(d);
  const thisMonthRevenue = await getCustomerCount(range.start, range.end);

  d = moment(d).subtract(1, 'months').toDate();
  range = getMonthDateRange(d);
  const lastMonthRevenue = await getCustomerCount(range.start, range.end);

  return lastMonthRevenue > 0 ?
    ((thisMonthRevenue - lastMonthRevenue) * 100) / lastMonthRevenue :
    0;
}

async function getAppDownloadCount(from, to) {
  const filters = {
    type: Event.TYPE_APP_DOWNLOAD,
  };
  if (from || to) {
    filters.createdAt = {};
  }
  if (from) {
    filters.createdAt.$gt = from;
  }
  if (to) {
    filters.createdAt.$lt = to;
  }

  const result = await Event.countDocuments(filters);
  return result;
}

async function getAppDownloadSinceLastMonth() {
  let d = new Date();
  let range = getMonthDateRange(d);
  const thisMonth = await getAppDownloadCount(range.start, range.end);

  d = moment(d).subtract(1, 'months').toDate();
  range = getMonthDateRange(d);
  const lastMonth = await getAppDownloadCount(range.start, range.end);

  return lastMonth > 0 ?
    ((thisMonth - lastMonth) * 100) / lastMonth :
    0;
}

async function getContractorCount() {
  const filters = {
    roles: User.ROLE_CONTRACTOR,
    status: User.STATUS_ACTIVE,
  };
  const result = await User.countDocuments(filters);
  return result;
}

function getTimeRangesForChart(from, to) {
  const ranges = [];
  const duration = moment.duration(to.diff(from));
  const days = Math.ceil(duration.asDays());

  if (days > 56) { // Return monthly data
    let f = moment.utc(from).startOf('month')
      .hour(from.hour())
      .minute(from.minute())
      .second(from.second())
      .millisecond(from.millisecond());
    let t;
    do {
      t = moment.utc(f).add(1, 'month').subtract(1, 'millisecond');
      ranges.push([f, t]);
      f = moment.utc(t).add(1, 'millisecond');
    } while (t < to);
  } else if (days > 13) { // Return weekly data
    let f = moment.utc(from).add(1, 'week');
    let t;
    do {
      t = moment.utc(f).add(7, 'day').subtract(1, 'millisecond');
      if (t > to) {
        t = to;
      }
      ranges.push([f, t]);
      f = moment.utc(t).add(1, 'millisecond');
    } while (t < to);
  } else { // Return daily data
    let f = moment.utc(from);
    let t;
    do {
      t = moment.utc(f).add(1, 'day').subtract(1, 'millisecond');
      ranges.push([f, t]);
      f = moment.utc(t).add(1, 'millisecond');
    } while (t < to);
  }
  return ranges;
}

async function getRevenue(from, to, model) {
  const df = moment.utc(from);
  const dt = moment.utc(to);
  const ranges = getTimeRangesForChart(df, dt);
  const result = await Promise.all(ranges.map(async ([f, t]) => {
    const total = await calcTotal(model, { paid: true }, f, t);
    return {
      from: f,
      to: t,
      total,
    };
  }));
  return result;
}

function getBinReqRevenue(from, to) {
  return getRevenue(from, to, BinRequest);
}

function getColReqRevenue(from, to) {
  return getRevenue(from, to, CollectionRequest);
}

async function getRate(from, to) {
  const df = moment.utc(from);
  const dt = moment.utc(to);
  const ranges = getTimeRangesForChart(df, dt);
  const result = await Promise.all(ranges.map(async ([f, t]) => {
    const binTotal = await calcTotal(BinRequest, { status: BinRequest.STATUS_COMPLETED }, f, t);
    const colReqTotal = await calcTotal(CollectionRequest, { paid: true }, f, t);
    const total = binTotal + colReqTotal;
    return {
      from: f,
      to: t,
      binReq: total > 0 ? (binTotal * 100) / total : 0,
      colReq: total > 0 ? (colReqTotal * 100) / total : 0,
    };
  }));
  return result;
}

function getAtRiskFilter({ limit = 10, page = 1, s }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);

  const conditions = {
    roles: User.ROLE_DRIVER,
    rating: { $lt: 3.5 },
    status: User.STATUS_ACTIVE,
  };

  if (s) {
    conditions.$or = [
      { uId: new RegExp(escapeRegExp(s), 'i') },
      { 'organisation.name': new RegExp(escapeRegExp(s), 'i') },
    ];
  }

  const pipelines = [
    {
      $lookup: {
        from: 'organisations',
        localField: 'driverProfile.organisation',
        foreignField: '_id',
        as: 'organisation',
      },
    },
    {
      $match: conditions,
    },
    {
      $unwind: {
        path: '$organisation',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        'organisation.payment': 0,
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
  };
}

function getPendingColReqFilter({ limit = 10, page = 1, s }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    status: CollectionRequest.STATUS_REQUESTED,
  };
  if (s) {
    conditions.$or = [
      { uId: new RegExp(escapeRegExp(s), 'i') },
      { 'organisation.name': new RegExp(escapeRegExp(s), 'i') },
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

async function getNonActivityCount() {
  const last3Months = moment().subtract(3, 'months').toDate();
  const data = await User.aggregate([
    {
      $match: {
        roles: User.ROLE_DRIVER,
        status: User.STATUS_ACTIVE,
        'driverProfile.lastJobAt': { $lt: last3Months },
      },
    },
    { $group: { _id: null, total: { $sum: 1 } } },
  ]);
  return data.length > 0 ? data[0].total : 0;
}

async function getMapInfo(from, to) {
  const dateFrom = moment.utc(from).toDate();
  const dateTo = moment.utc(to).toDate();
  const brItems = await BinRequest.aggregate([
    {
      $match: {
        paid: true,
        status: BinRequest.STATUS_COMPLETED,
        createdAt: { $lt: dateTo, $gt: dateFrom },
      },
    },
    {
      $group: {
        _id: '$shippingState',
        total: { $sum: '$total' },
      },
    },
  ]);
  const crItems = await CollectionRequest.aggregate([
    {
      $match: {
        paid: true,
        status: CollectionRequest.STATUS_COMPLETED,
        createdAt: { $lt: dateTo, $gt: dateFrom },
      },
    },
    {
      $group: {
        _id: '$collectionState',
        total: { $sum: '$total' },
      },
    },
  ]);
  const states = await State.find({}, { name: 1 });
  const result = states.map((state) => {
    const binItem = brItems.find(item => item._id === state.name);
    const binReqRev = binItem ? binItem.total : 0;
    const colItem = crItems.find(item => item._id === state.name);
    const colReqRev = colItem ? colItem.total : 0;
    const totalRev = binReqRev + colReqRev;
    return {
      name: state.name,
      binReqRev,
      colReqRev,
      totalRev,
    };
  });
  return result;
}

module.exports = {
  getTotalRevenue,
  getRevenueSinceLastMonth,
  getBinRequestCount,
  getPendingBinRequestCount,
  getColRequestCount,
  getPendingColRequestCount,
  getCustomerCount,
  getCustomerSinceLastMonth,
  getAppDownloadCount,
  getAppDownloadSinceLastMonth,
  getContractorCount,
  getBinReqRevenue,
  getColReqRevenue,
  getRate,
  getAtRiskFilter,
  getPendingColReqFilter,
  getMapInfo,
  getTimeRangesForChart,
  getNonActivityCount,
};
