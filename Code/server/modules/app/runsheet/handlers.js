const moment = require('moment');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const CollectionRequest = require('../models/collection-request');
const CouncilAddress = require('../models/council-address-db/address');
const { notFoundExc, generateGeoAddress } = require('../../common/helpers');
const Organisation = require('../models/organisation');
const Bin = require('../models/bin');
const EmailHelper = require('../helpers/email');
const SMSHelper = require('../helpers/sms');
const config = require('../../../config');
const { getQueryData } = require('./helpers');
const {
    loadGoogleSheetReport,
    mapCollectionRequestReportDataToColumn,
} = require('../../common/google-sheet-helpers');

async function getSummaryCollection(req, res, next) {
    try {
        const { url, password } = req.body;
        const organisation = await Organisation.findOne({
            'runsheet.url': url,
        });
        if (!organisation) {
            return next(notFoundExc('Organisation not found'));
        }
        if (organisation.runsheet.password !== password) {
            return next(notFoundExc('Password not match'));
        }
        const query = getQueryData(req.query, organisation._id);

        const rawData = await CollectionRequest.aggregate(query.pipelines);
        const total =
            (rawData[0] && rawData[0].total[0] && rawData[0].total[0].count) ||
            0;
        const colReqs = rawData[0] && rawData[0].data;

        const result = await Promise.all(
            colReqs.map(async (item) => {
                const { createdAt, code, collectionAddress, status, comment } =
                    item;
                const dueDate = moment(createdAt).add(3, 'days').startOf('day');
                const dayCount = moment(dueDate).diff(
                    moment().startOf('day'),
                    'days',
                );

                const { addressTreated, postcode } =
                    generateGeoAddress(collectionAddress);
                const councilAddr = await CouncilAddress.findOne({
                    address_1: {
                        $regex: addressTreated,
                    },
                    postcode,
                });
                return {
                    _id: item._id,
                    createdAt,
                    collectionAddress,
                    status,
                    dueDate,
                    dayCount,
                    division: councilAddr
                        ? councilAddr.class_electoral_division
                        : null,
                    comment,
                    address: collectionAddress,
                    qrCode: code,
                    crCode: code,
                };
            }),
        );

        const pagination = {
            pageCount: Math.ceil(total / query.limit),
            currentPage: query.page,
            perPage: query.limit,
            totalCount: total,
        };

        return res.json({
            collections: result,
            organisation: organisation.toObject(),
            pagination,
        });
    } catch (err) {
        return next(err);
    }
}

async function pendingStatusReport(req, res, next) {
    try {
        const { organisationId, status } = req.query;

        const isExportPending = status === 'Pending';

        const statusFilter = isExportPending
            ? [
                  CollectionRequest.STATUS_REQUESTED,
                  CollectionRequest.STATUS_ACCEPTED,
                  CollectionRequest.STATUS_IN_PROGRESS,
                CollectionRequest.STATUS_FUTILED,
              ]
            : [
                  CollectionRequest.STATUS_COMPLETED,
                  CollectionRequest.STATUS_CANCELLED,
              ];

        const colReqs = await CollectionRequest.find({
            contractorOrganisation: organisationId,
            status: {
                $in: statusFilter,
            },
        })
            .sort({ createdAt: -1 })
            .populate('items.product')
            .populate('items.bin')
            .populate('contractorOrganisation')
            .populate('customer');

        const colSheet = await loadGoogleSheetReport(
            config.collectionRequestSheetReport,
        );
        await colSheet.loadHeaderRow();
        const HEADER_ROW = colSheet.headerValues;

        const items = await mapCollectionRequestReportDataToColumn(
            HEADER_ROW,
            colReqs,
        );

        const csvStringifier = createCsvStringifier({
            header: HEADER_ROW.map((h) => ({ id: h, title: h })),
        });
        const header = csvStringifier.getHeaderString();
        const content = csvStringifier.stringifyRecords(items);
        const fileName = isExportPending
            ? 'pending-collection-report.csv'
            : 'completed-collection-report.csv';
        res.setHeader(
            'Content-disposition',
            `attachment; filename=${fileName}`,
        );
        res.set('Content-Type', 'text/csv');
        return res.send(`${header}${content}`);
    } catch (err) {
        return next(err);
    }
}

async function closeJob(req, res, next) {
    try {
        const colReq = await CollectionRequest.findById(req.params.id)
            .populate('items.bin')
            .populate('driver')
            .populate('customer');

        if (!colReq) {
            return next(notFoundExc('Collection Request not found'));
        }

        await Promise.all(
            colReq.items.map(async (item) => {
                const { bin } = item;
                const colReqItem = colReq.items.find(
                    (item) => item.bin._id.toString() === bin._id.toString(),
                );

                // update bin's status
                await bin.updateDeliveryStatus(Bin.STATUS_DELIVERED);
                await bin.updateCollectionStatus(Bin.STATUS_COMPLETED);

                // save bin's status in this collection request
                colReqItem.binStatus = bin.collectionStatus;
            }),
        );
        // Set status collection request
        await colReq.updateStatus(CollectionRequest.STATUS_COMPLETED);

        EmailHelper.sendFinishedJobEmailToCustomer(
            colReq.driver,
            colReq,
            colReq.items[0].product.prefix,
            `${config.webUrl}/rating-collection-request/${req.params.id}`,
        );
        SMSHelper.sendFinishedJobSMSToCustomer(
            colReq.customer,
            colReq,
            `${config.webUrl}/rating-collection-request/${req.params.id}`,
        );

        return res.json(colReq);
    } catch (err) {
        return next(err);
    }
}

async function updateColletion(req, res, next) {
    try {
        const colReq = await CollectionRequest.findOne({
            _id: req.params.id,
            status: { $ne: CollectionRequest.STATUS_DRAFT },
        });
        if (!colReq) {
            return next(notFoundExc('Collection request not found'));
        }

        const data = req.body;

        colReq.comment = data.comment;

        await colReq.save();

        return res.json(colReq);
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    getSummaryCollection,
    pendingStatusReport,
    closeJob,
    updateColletion,
};
