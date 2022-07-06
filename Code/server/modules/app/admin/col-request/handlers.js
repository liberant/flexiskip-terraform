const moment = require('moment');
const Promise = require('bluebird');
const Bin = require('../../models/bin');
const CollectionRequest = require('../../models/collection-request');
const CollectionRequestStatus = require('../../models/collection-request-status');
const Review = require('../../models/review');
const {
  getQueryData,
  validateUpdateForm,
} = require('./helpers');
const {
  notFoundExc,
  validationExc,
} = require('../../../common/helpers');
const {
  loadGoogleSheetReport,
  mapCollectionRequestReportDataToColumn,
} = require('../../../common/google-sheet-helpers');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const config = require('../../../../config');


async function getItems(req, res, next) {
  try {
    const query = getQueryData(req.query, req.user._id);
    const rawData = await CollectionRequest.aggregate(query.pipelines);

    const pendingStatus = [
      CollectionRequest.STATUS_REQUESTED,
      CollectionRequest.STATUS_ACCEPTED,
      CollectionRequest.STATUS_IN_PROGRESS,
      CollectionRequest.STATUS_FUTILED,
    ];

    const colReqsPending = await CollectionRequest.find({
      status: {
        $in: pendingStatus,
      },
    });

    const colReqsOverDue = colReqsPending.filter((colReq) => {
      const dueDate = moment(colReq.createdAt).add(3, 'days');
      return moment().isAfter(dueDate);
    });

    if (!rawData[0].total.length || !rawData[0].data.length) {
      return next(notFoundExc('No matching results were found'));
    }
    const total = rawData[0].total[0].count;
    const colReqs = rawData[0].data;

    const result = await Promise.all(colReqs.map(async (colReq) => {
      const c = colReq;
      c.items = await Promise.all(c.items.map(async (item) => {
        const bin = await Bin.findById(item.bin);
        return {
          ...item,
          bin,
        };
      }));
      return c;
    }));

    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .set('X-Pagination-Pending-Count', colReqsPending.length)
      .set('X-Pagination-OverDue-Count', colReqsOverDue.length)
      .json(result);
  } catch (err) {
    return next(err);
  }
}

async function getItem(req, res, next) {
  try {
    const item = await CollectionRequest.findOne({
      _id: req.params.id,
      status: { $ne: CollectionRequest.STATUS_DRAFT },
    }).populate('customer')
      .populate('driver')
      .populate('contractorOrganisation')
      .populate('items.bin');

    if (!item) {
      return next(notFoundExc('Order not found'));
    }

    const result = item.toObject();
    if (item.driver) {
      result.driver.rate = await Review.findOne({
        collectionRequest: item._id,
        reviewee: item.driver._id,
      });
    }

    if (item.contractorOrganisation) {
      result.contractorOrganisation.rate = await Review.findOne({
        collectionRequest: item._id,
        reviewee: item.contractorOrganisation._id,
      });
    }

    result.customer.rate = await Review.findOne({
      collectionRequest: item._id,
      reviewee: item.customer._id,
    });

    result.statusHistory = await CollectionRequestStatus.find({
      collectionRequest: item._id,
    }).sort({
      createdAt: 1,
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const colReq = await CollectionRequest.findOne({
      _id: req.params.id,
      status: { $ne: CollectionRequest.STATUS_DRAFT },
    });
    if (!colReq) {
      return next(notFoundExc('Collection request not found'));
    }

    const data = req.body;

    if (data.contractorOrganisation) {
      // assign supplier
      colReq.contractorOrganisation = data.contractorOrganisation;
    } else {
      const errors = validateUpdateForm(data, colReq);
      if (errors) {
        return next(validationExc('Please correct your input', errors));
      }

      colReq.driver = undefined;
      colReq.status = data.status;
      colReq.disposalAddress = data.disposalAddress;
      colReq.disposalLocation = data.disposalLocation;
      colReq.disposalSite = data.disposalSite;
      colReq.comment = data.comment;
      if (colReq.status === CollectionRequest.STATUS_REQUESTED) {
        await colReq.setCollectionAddress(data.collectionAddress);
      }
      // Update bins
      const { binUpdates } = req.body;
      if (Object.keys(binUpdates).length) {
        const result = await Promise.map(Object.keys(binUpdates), key => Bin.updateOne(
          { _id: key },
          { $set: binUpdates[key] },
        ));
      }
      colReq.broadcastColReqToDrivers();
    }
    await colReq.save();

    return res.json(colReq);
  } catch (err) {
    return next(err);
  }
}

async function exportItems(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const rawData = await CollectionRequest.aggregate(query.pipelines);

    if (!rawData) {
      return next(notFoundExc('No matching results were found'));
    }

    const colReqs = await Promise.all(rawData[0].data.map(async (item) => {
      const binReq = await CollectionRequest.findById(item._id)
        .populate('items.product')
        .populate('items.bin')
        .populate('contractorOrganisation')
        .populate('customer');

      return binReq;
    }));

    const colSheet = await loadGoogleSheetReport(config.collectionRequestSheetReport);
    await colSheet.loadHeaderRow();
    const HEADER_ROW = colSheet.headerValues;

    const items = await mapCollectionRequestReportDataToColumn(
      HEADER_ROW,
      colReqs,
    );

    const csvStringifier = createCsvStringifier({
      header: HEADER_ROW.map(h => ({ id: h, title: h })),
    });
    const header = csvStringifier.getHeaderString();
    const content = csvStringifier.stringifyRecords(items);

    res.setHeader(
      'Content-disposition',
      'attachment; filename=collection-report.csv',
    );
    res.set('Content-Type', 'text/csv');
    return res.send(`${header}${content}`);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getItems,
  getItem,
  updateItem,
  exportItems,
};
