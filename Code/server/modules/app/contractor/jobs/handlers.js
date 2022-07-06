const { getQueryData } = require('./helpers');
const { notFoundExc } = require('../../../common/helpers');
const CollectionRequest = require('../../models/collection-request');
const User = require('../../models/user');

async function getUnassignedJobs(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const { user } = req;

    const MAX_DISTANCE = 50000; // 50km
    const [lng, lat] = user.location.coordinates;

    const findParams = {
      status: CollectionRequest.STATUS_REQUESTED,
      collectionLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: MAX_DISTANCE,
          $minDistance: 0,
        },
      },
      ...query.conditions,
      driver: null,
    };

    const findParamsForCount = {
      status: CollectionRequest.STATUS_REQUESTED,
      collectionLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], MAX_DISTANCE / 6371000],
        },
      },
      ...query.conditions,
      driver: null,
    };

    const total = await CollectionRequest.countDocuments(findParamsForCount);
    const requests = await CollectionRequest.find(findParams)
      .skip(query.offset)
      .limit(query.limit)
      .populate('driver');

    const data = await Promise.all(requests.map(item => item.toClientObject()));
    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(data);
  } catch (err) {
    return next(err);
  }
}

async function assignDriver(req, res, next) {
  try {
    const { driverId } = req.body;
    const { jobId } = req.params;
    const colReq = await CollectionRequest.findById(jobId)
      .populate('items.bin')
      .populate('customer');
    if (!colReq) {
      return next(notFoundExc('Collection request not found'));
    }

    const driver = await User.findById(driverId);
    if (!driver) {
      return next(notFoundExc('Driver not found'));
    }

    const result = await driver.acceptJob(colReq);
    return res.json({ result });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getUnassignedJobs,
  assignDriver,
};
