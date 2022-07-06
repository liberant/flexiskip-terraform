const moment = require('moment');
const User = require('../../models/user');
const CollectionRequest = require('../../models/collection-request');
const { notFoundExc, escapeRegExp } = require('../../../common/helpers');
const {
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
  getNonActivityCount,
  getBinReqRevenue,
  getColReqRevenue,
  getRate,
  getAtRiskFilter,
  getPendingColReqFilter,
  getMapInfo,
} = require('./helpers');


async function getSummarySection(req, res, next) {
  try {
    const [
      revenue,
      revenueSinceLastMonth,
      binReqCount,
      pendingBinReqCount,
      colReqCount,
      pendingColReqCount,
      customerCount,
      customerSinceLastMonth,
      appDownloadCount,
      appDownloadSinceLastMonth,
      contractorCount,
      nonActivityCount,
    ] = await Promise.all([
      getTotalRevenue(),
      getRevenueSinceLastMonth(),
      getBinRequestCount(),
      getPendingBinRequestCount(),
      getColRequestCount(),
      getPendingColRequestCount(),
      getCustomerCount(),
      getCustomerSinceLastMonth(),
      getAppDownloadCount(),
      getAppDownloadSinceLastMonth(),
      getContractorCount(),
      getNonActivityCount(),
    ]);

    res.json({
      revenue,
      revenueSinceLastMonth,
      binReqCount,
      pendingBinReqCount,
      colReqCount,
      pendingColReqCount,
      customerCount,
      customerSinceLastMonth,
      appDownloadCount,
      appDownloadSinceLastMonth,
      contractorCount,
      nonActivityCount,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GetRevenueSection
 * Note: The UI should send local time instead of utc time
 * because we should split time to timespan depend on local time
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getRevenueSection(req, res, next) {
  try {
    const { from, to } = req.query;
    const [
      binReqRevenue,
      colReqRevenue,
    ] = await Promise.all([
      getBinReqRevenue(from, to),
      getColReqRevenue(from, to),
    ]);

    res.json({
      binReqRevenue,
      colReqRevenue,
    });
  } catch (err) {
    next(err);
  }
}

async function getRateSection(req, res, next) {
  try {
    const { from, to } = req.query;
    const result = await getRate(from, to);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getAtRiskSection(req, res, next) {
  try {
    const query = getAtRiskFilter(req.query);
    const total = (await User.aggregate(query.pipelines)).length;
    const items = await User.aggregate(query.pipelines)
      .sort({ createdAt: -1 })
      .skip(query.offset)
      .limit(query.limit);

    res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(items);
  } catch (err) {
    next(err);
  }
}

async function getInactiveSection(req, res, next) {
  try {
    const { s } = req.query;
    let { limit = 10, page = 1 } = req.query;
    limit = parseInt(limit, 10);
    page = parseInt(page, 10);
    const offset = (page - 1) * limit;
    const pipelines = [
      {
        $match: {
          roles: User.ROLE_DRIVER,
          status: User.STATUS_ACTIVE,
          'driverProfile.lastJobAt': { $lt: moment.utc().subtract(90, 'day').toDate() },
        },
      },
      {
        $lookup: {
          from: 'organisations',
          localField: 'driverProfile.organisation',
          foreignField: '_id',
          as: 'driverProfile.organisation',
        },
      },
    ];

    if (s) {
      const search = new RegExp(escapeRegExp(s), 'i');
      pipelines.push({
        $match: {
          $or: [
            { uId: search },
            { email: search },
            { 'driverProfile.organisation.name': search },
          ],
        },
      });
    }

    pipelines.push({
      $unwind: {
        path: '$driverProfile.organisation',
        preserveNullAndEmptyArrays: true,
      },
    });

    const total = (await User.aggregate(pipelines)).length;
    const items = await User.aggregate(pipelines)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res
      .set('X-Pagination-Page-Count', Math.ceil(total / limit))
      .set('X-Pagination-Current-Page', page)
      .set('X-Pagination-Per-Page', limit)
      .set('X-Pagination-Total-Count', total)
      .json(items);
  } catch (err) {
    next(err);
  }
}

async function getPendingColReqs(req, res, next) {
  try {
    const query = getPendingColReqFilter(req.query);
    const total = await CollectionRequest.countDocuments(query.conditions);
    const items = await CollectionRequest.find(query.conditions)
      .skip(query.offset)
      .limit(query.limit)
      .sort({ collectBy: 1 });
    res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(items);
  } catch (err) {
    next(err);
  }
}

async function findDrivers(req, res, next) {
  try {
    const colReq = await CollectionRequest.findById(req.params.id);
    if (!colReq) {
      return next(notFoundExc('Collection request not found'));
    }
    const shouldApplyFilter = !(req.user.roles.includes('admin') || req.user.roles.includes('adminlv2'));
    const drivers = await colReq.findDriversForCollection(shouldApplyFilter);
    return res.json(drivers);
  } catch (err) {
    return next(err);
  }
}

async function assignDriver(req, res, next) {
  try {
    const colReq = await CollectionRequest.findById(req.params.id)
      .populate('items.bin')
      .populate('customer');
    if (!colReq) {
      return next(notFoundExc('Collection request not found'));
    }

    const driver = await User.findById(req.body.driver);
    if (!driver) {
      return next(notFoundExc('Driver not found'));
    }

    await driver.acceptJob(colReq);
    return res.json(colReq);
  } catch (err) {
    return next(err);
  }
}

async function getMapSection(req, res, next) {
  try {
    const { from, to } = req.query;
    const map = await getMapInfo(from, to);
    res.json(map);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSummarySection,
  getRevenueSection,
  getRateSection,
  getAtRiskSection,
  getInactiveSection,
  getPendingColReqs,
  findDrivers,
  assignDriver,
  getMapSection,
};
