const moment = require('moment');
const CollectionRequest = require('../../models/collection-request');
const Review = require('../../models/review');
const { getMonthDateRange } = require('../../../common/helpers');

/**
 * getPreviousHoursInToday
 * @param {number} hours (0-23)
 * https://momentjs.com/docs/#/get-set/hour/
 * hour range in day: 0 - 23
 */
function getPreviousHoursInToday(hours) {
  const currentHours = moment().hours();
  if (currentHours >= hours) {
    return moment().hours(currentHours - hours).toDate();
  }
  const hoursPreviousDay = (24 - hours) + currentHours;
  return moment().subtract(1, 'days').hours(hoursPreviousDay).toDate();
}

/**
 * Get total price of collection requests
 * @param {String} organisation
 * @param {String} from
 * @param {String} to
 */
async function calcTotal(organisation, from, to) {
  const filters = {
    paid: true,
    contractorOrganisation: organisation,
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

  const data = await CollectionRequest.aggregate([
    { $match: filters },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  return data.length > 0 ? data[0].total : 0;
}

// get total revenue from bin request and collection request
async function getTotalRevenue(organisation) {
  const d = new Date();
  const range = getMonthDateRange(d);
  return calcTotal(organisation, range.start, range.end);
}

// get difference between last month and this month revenue
async function getRevenueSinceLastMonth(organisation) {
  let d = new Date();
  let range = getMonthDateRange(d);
  const thisMonthRevenue = await getTotalRevenue(organisation);

  d = moment(d).subtract(1, 'months').toDate();
  range = getMonthDateRange(d);
  const lastMonthRevenue = await calcTotal(organisation, range.start, range.end);

  return lastMonthRevenue > 0 ?
    ((thisMonthRevenue - lastMonthRevenue) * 100) / lastMonthRevenue :
    0;
}

/**
 * Get total num of collection requests in a specific of time
 *
 * @param {Date} from
 * @param {Date} to
 * @param {String} organisation
 */
async function countColReq(organisation, from, to) {
  const filters = {
    status: CollectionRequest.STATUS_COMPLETED,
    contractorOrganisation: organisation,
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

  const result = await CollectionRequest.countDocuments(filters);
  return result;
}

/**
 * Count the total of collection request in current month
 * @param {String} organisation
 * @return {Promise} resolve a number
 */
async function getColReqCount(organisation) {
  const d = new Date();
  const range = getMonthDateRange(d);
  return countColReq(organisation, range.start, range.end);
}

/**
 * Return the percentage increment of collection request of this month
 * compared to last month
 * @param {String} organisation
 */
async function getColReqCountSinceLastMonth(organisation) {
  const thisMonthCount = await getColReqCount(organisation);

  let d = new Date();
  d = moment(d).subtract(1, 'months').toDate();
  const range = getMonthDateRange(d);
  const lstMonthCount = await countColReq(organisation, range.start, range.end);

  return lstMonthCount > 0 ?
    ((thisMonthCount - lstMonthCount) * 100) / lstMonthCount :
    null;
}

/**
 * formula: SUM (Collection request * Star number) / SUM (Collection request)
 */
async function getAvgRating(organisation) {
  const data = await Review.aggregate([
    {
      $lookup: {
        from: 'collectionRequests',
        localField: 'collectionRequest',
        foreignField: '_id',
        as: 'collectionRequest',
      },
    },
    {
      $match: {
        'collectionRequest.status': CollectionRequest.STATUS_COMPLETED,
        'collectionRequest.contractorOrganisation': organisation,
      },
    },
    {
      $group: {
        _id: '$_id',
        rating: {
          $avg: '$point',
        },
      },
    },
  ]);
  return data.reduce((sum, { rating }) => sum + rating, 0) / data.length;
}

async function getAvgColTime(org) {
  const data = await CollectionRequest.aggregate([
    {
      $match: {
        status: 'Completed',
        contractorOrganisation: org._id,
      },
    },
    {
      $project: {
        code: 1,
        colTime: { $subtract: ['$collectedAt', '$acceptedAt'] },
      },
    },
    {
      $group: {
        _id: null,
        avgColTime: { $avg: '$colTime' },
      },
    },
  ]);
  return data.length > 0 ? data[0].avgColTime / 1000 : 0;
}

async function getPendingColReqCountIn6h(organisation) {
  const toDate = moment().toDate();
  // minus 1 days and plus 18h = get 6h previous
  const fromDate = getPreviousHoursInToday(6);
  const data = await CollectionRequest.aggregate([
    {
      $match: {
        status: CollectionRequest.STATUS_REQUESTED,
        contractorOrganisation: organisation,
        createdAt: {
          $gt: fromDate,
          $lt: toDate,
        },
      },
    },
  ]);
  return data.length;
}

async function getPendingColReqCountIn48h(organisation) {
  const toDate = moment().toDate();
  const fromDate = moment().subtract(2, 'days').toDate();
  const data = await CollectionRequest.aggregate([
    {
      $match: {
        status: CollectionRequest.STATUS_REQUESTED,
        contractorOrganisation: organisation,
        createdAt: {
          $gt: fromDate,
          $lt: toDate,
        },
      },
    },
  ]);
  return data.length;
}

/**
 * getNonConformanceCount
 * @param {*} organisation
 * Requirements from HAND-927
 */
async function getNonConformanceCount(organisation) {
  const data = await Review.aggregate([
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
        localField: 'reviewee',
        foreignField: '_id',
        as: 'reviewee',
      },
    },
    {
      $match: {
        'collectionRequest.status': CollectionRequest.STATUS_COMPLETED,
        'collectionRequest.contractorOrganisation': organisation,
      },
    },
    {
      $unwind: {
        path: '$reviewee',
      },
    },
    {
      $group: {
        _id: '$_id',
        rating: {
          $avg: '$point',
        },
      },
    },
  ]);

  return data.reduce((sum, { rating }) => {
    if (rating <= 3) {
      return sum + 1;
    }
    return sum;
  }, 0);
}

function getTimeRangesForChart(from, to) {
  const ranges = [];
  const duration = moment.duration(moment(to).diff(moment(from)));
  const days = duration.asDays();

  if (days > 56) { // Return monthly data
    let f = moment(from).startOf('month').toDate();
    let t;
    do {
      t = moment(f).endOf('month').toDate();
      ranges.push([f, t]);
      f = moment(t).add(1, 'second').toDate();
    } while (t < to);
  } else if (days > 13) { // Return weekly data
    let f = moment(from).startOf('day').toDate();
    let t;
    do {
      t = moment(f).add(7, 'day').startOf('day').toDate();
      if (t > to) {
        t = to;
      }
      ranges.push([f, t]);
      f = moment(t).add(1, 'second').toDate();
    } while (t < to);
  } else { // Return daily data
    let f = moment(from).startOf('day').toDate();
    let t;
    do {
      t = moment(f).endOf('day').toDate();
      ranges.push([f, t]);
      f = moment(t).add(1, 'second').toDate();
    } while (t < to);
  }
  return ranges;
}

async function getRevenueChart(user, from, to) {
  const df = new Date(from);
  const dt = new Date(to);
  const ranges = getTimeRangesForChart(df, dt);
  const result = await Promise.all(ranges.map(async ([f, t]) => {
    const total = await calcTotal(user.contractorProfile.organisation, f, t, true);
    return {
      from: f,
      to: t,
      total,
    };
  }));
  return result;
}

module.exports = {
  getTotalRevenue,
  getRevenueSinceLastMonth,
  getColReqCount,
  getColReqCountSinceLastMonth,
  getAvgRating,
  getAvgColTime,
  getPendingColReqCountIn6h,
  getPendingColReqCountIn48h,
  getNonConformanceCount,
  getRevenueChart,
};
