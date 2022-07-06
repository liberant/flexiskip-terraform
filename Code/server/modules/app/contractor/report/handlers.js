const moment = require('moment');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const CollectionRequest = require('../../models/collection-request');
const Organisation = require('../../models/organisation');

async function transactionReport(req, res, next) {
  try {
    const org = await Organisation.findById(req.user.contractorProfile.organisation);
    const colReqs = await CollectionRequest.find({
      status: CollectionRequest.STATUS_COMPLETED,
      contractorOrganisation: org._id,
    })
      .sort({ createdAt: -1 })
      .populate('items.product')
      .populate('items.bin');

    const items = await Promise.all(colReqs.map(async colReq => ({
      createdAt: moment(colReq.createdAt).format('DD/MM/YYYY'),
      code: colReq.code,
      collectionAddress: colReq.collectionAddress,
      status: colReq.status,
      qrCodes: colReq.items.map(item => item.bin.code).join(', '),
    })));

    const csvStringifier = createCsvStringifier({
      header: [
        { id: 'createdAt', title: 'Service date' },
        { id: 'code', title: 'CR reference number' },
        { id: 'collectionAddress', title: 'Collection Address' },
        { id: 'status', title: 'Status' },
        { id: 'qrCodes', title: 'QR Codes' },
      ],
    });
    const header = csvStringifier.getHeaderString();
    const content = csvStringifier.stringifyRecords(items);
    res.setHeader('Content-disposition', 'attachment; filename=activity-report.csv');
    res.set('Content-Type', 'text/csv');
    return res.send(`${header}${content}`);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  transactionReport,
};
