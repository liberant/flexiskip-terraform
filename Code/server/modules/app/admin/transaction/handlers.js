const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const { PAYMENT_TYPE_INVOICE } = require('../../models/payment');
const { formatDate } = require('../../../common/helpers');
const BinRequest = require('../../models/bin-request');
const CollectionRequest = require('../../models/collection-request');
const {
  validationExc,
} = require('../../../common/helpers');
const {
  getQueryData,
  validateParams,
} = require('./helpers');


async function getTransactions(req, res, next) {
  try {
    const errors = validateParams(req.query);
    if (errors) {
      return next(validationExc('Please correct your input on params', errors));
    }
    const { type } = req.query;
    const Model = type === 'bin' ? BinRequest : CollectionRequest;

    const query = getQueryData(req.query);

    const total = (await Model.aggregate(query.pipelines)).length;
    const data = await Model.aggregate(query.pipelines)
      .sort(query.sort)
      .skip(query.offset)
      .limit(query.limit);

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

async function exportTransactions(req, res, next) {
  try {
    const errors = validateParams(req.query);
    if (errors) {
      return next(validationExc('Please correct your input on params', errors));
    }
    const { type } = req.query;
    const Model = type === 'bin' ? BinRequest : CollectionRequest;

    const query = getQueryData(req.query);

    const data = await Model.aggregate(query.pipelines).sort(query.sort);

    const items = data.map((item) => {
      const createdDate = formatDate(item.createdAt);
      const customer = item.customer || {};
      return {
        code: item.code,
        transactionID: item.stripeChargeId,
        customer: customer.fullname,
        createdDate,
        paymentType: item.paymentType,
        invoiceCode: item.paymentType === PAYMENT_TYPE_INVOICE && item.invoiceCode ? `${item.invoiceCode}` : '',
        totalAmount: item.total,
        discountAmount: item.discount,
        status: item.status,
      };
    });

    const csvStringifier = createCsvStringifier({
      header: [
        { id: 'code', title: 'Order Ref' },
        { id: 'transactionID', title: 'Transaction ID' },
        { id: 'customer', title: 'Customer' },
        { id: 'createdDate', title: 'Date Created' },
        { id: 'paymentType', title: 'Payment Type' },
        { id: 'invoiceCode', title: 'Purchase Order Number' },
        { id: 'totalAmount', title: 'Total Amount' },
        { id: 'discountAmount', title: 'Discount Amount' },
        { id: 'status', title: 'Status' },
      ],
    });

    const header = csvStringifier.getHeaderString();
    const content = csvStringifier.stringifyRecords(items);
    res.setHeader('Content-disposition', `attachment; filename=${type}-transaction.csv`);
    res.set('Content-Type', 'text/csv');
    return res.send(`${header}${content}`);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getTransactions,
  exportTransactions,
};
