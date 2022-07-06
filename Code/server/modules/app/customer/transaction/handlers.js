const CollectionRequest = require('../../models/collection-request');
const BinRequest = require('../../models/bin-request');
const { combineRequests, getQueryData, groupRequest } = require('./helpers');

async function getCurrentTransactions(req, res, next) {
  try {
    const dataType = req.query.type;
    const query = getQueryData(req.query);

    const binRequestConditions = {
      status: {
        $in: [
          BinRequest.STATUS_PENDING,
          BinRequest.STATUS_IN_PROGRESS,
        ],
      },
      customer: req.user._id,
    };

    const binRequests = await BinRequest.find(binRequestConditions)
      .sort({ _id: -1 })
      .populate('items.product')
      .populate('bins');

    const collectionRequestsConditions = {
      status: {
        $in: [
          CollectionRequest.STATUS_REQUESTED,
          CollectionRequest.STATUS_ACCEPTED,
          CollectionRequest.STATUS_IN_PROGRESS,
        ],
      },
      customer: req.user._id,
    };
    const collectionRequests = await CollectionRequest.find(collectionRequestsConditions)
      .sort({ _id: -1 })
      .populate('items.bin');

    const combineTwoDocument = combineRequests(binRequests, collectionRequests, dataType);
    const total = combineTwoDocument.length;

    const result = groupRequest(combineTwoDocument.slice(query.offset, query.offset + query.limit));

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

async function getPastTransactions(req, res, next) {
  try {
    const dataType = req.query.type;
    const query = getQueryData(req.query);

    const binRequestConditions = {
      status: {
        $in: [BinRequest.STATUS_COMPLETED],
      },
      customer: req.user._id,
    };
    const binRequests = await BinRequest.find(binRequestConditions)
      .sort({ _id: -1 })
      .populate('items.product')
      .populate('bins');

    const collectionRequestsConditions = {
      status: {
        $in: [CollectionRequest.STATUS_COMPLETED],
      },
      customer: req.user._id,
    };
    const collectionRequests = await CollectionRequest.find(collectionRequestsConditions)
      .sort({ _id: -1 })
      .populate('items.bin');

    const combineTwoDocument = combineRequests(binRequests, collectionRequests, dataType);
    const total = combineTwoDocument.length;

    const result = groupRequest(combineTwoDocument.slice(query.offset, query.offset + query.limit));

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

module.exports = {
  getCurrentTransactions,
  getPastTransactions,
};
