const moment = require('moment');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const CollectionRequest = require('../../models/collection-request');
const User = require('../../models/user');
const Organisation = require('../../models/organisation');
const CollectionRequestStatus = require('../../models/collection-request-status');
const { getQueryData } = require('./helpers');
const { parseAddress } = require('../../../common/shipping');

// Get Vehicle List
async function getTransactions(req, res, next) {
  try {
    // find drivers that belong to current contractor
    const drivers = await User.find({
      'driverProfile.organisation': req.user.contractorProfile.organisation,
    });
    const driverIds = drivers.map(d => d._id);

    // query collection request by driver ids
    const query = getQueryData(req.query);
    query.conditions.driver = { $in: driverIds };
    const total = await CollectionRequest.countDocuments(query.conditions);
    const collectionRequests = await CollectionRequest.find(query.conditions)
      .sort({ _id: -1 })
      .skip(query.offset)
      .limit(query.limit)
      .populate('items.bin')
      .populate('customer')
      .populate('driver');

    const result = await Promise.all(collectionRequests.map(async (collectionRequest) => {
      const c = collectionRequest.toObject();
      c.driver = c.driver ? await collectionRequest.driver.toUserObject() : null;
      c.customer = c.customer ? await collectionRequest.customer.toUserObject() : null;
      return c;
    }));
    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(result);
  } catch (err) {
    return next(err);
  }
}

async function getTransactionDetail(req, res, next) {
  try {
    const collectionRequest = await CollectionRequest.findOne({
      _id: req.params.id,
    }).populate('items.bin')
      .populate('customer')
      .populate('driver');

    const collectionStatus = await CollectionRequestStatus.find({
      collectionRequest: req.params.id,
    });

    const result = collectionRequest.toObject();
    result.driver = result.driver ? await collectionRequest.driver.toUserObject() : null;
    result.customer = result.customer ? await collectionRequest.customer.toUserObject() : null;
    result.statusHistory = collectionStatus;

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getTransactions,
  getTransactionDetail,
};
