const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const PDFDocument = require('pdfkit');
const config = require('../../../../config');
const Address = require('../../models/address');
const User = require('../../models/user');
const BinRequest = require('../../models/bin-request');
const Product = require('../../models/product');
const BinRequestStatus = require('../../models/bin-request-status');
const Bin = require('../../models/bin');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const {
  loadGoogleSheetReport,
  mapProductReportDataToColumn,
} = require('../../../common/google-sheet-helpers');
const {
  geocoding,
} = require('../../../common/shipping');

const {
  notFoundExc,
  validationExc,
  checkAvailableDeliveryDate,
} = require('../../../common/helpers');
const {
  getQueryData,
  validateStatus,
  validateFormData,
  validateDeliveryStatus,
} = require('./helpers');
const {
  generateBinRequestCode,
} = require('../../helpers');
const {
  generateBinsForCustomer,
  createPdf,
  drawQRCodeAsPdf,
  generateQRCodeAndSendDelivery,
} = require('./helpers');
const CollectionRequest = require('../../models/collection-request');


const CSVRawData = require('./models/product-order');


async function getBinRequestList(req, res, next) {
  try {
    const query = getQueryData(req.query, req.user._id);
    const rawData = await BinRequest.aggregate(query.pipelines);
    const total = (rawData[0].total[0] && rawData[0].total[0].count) || 0;
    const binReqs = rawData[0].data;

    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(binReqs);
  } catch (err) {
    return next(err);
  }
}

async function getBinRequestDetail(req, res, next) {
  try {
    const br = await BinRequest.findOne({
      _id: req.params.id,
      status: { $ne: BinRequest.STATUS_DRAFT },
    });

    if (!br) {
      return next(notFoundExc('Order not found'));
    }

    await br
      .populate('customer')
      .populate('bins')
      .execPopulate();
    const statusHistory = await BinRequestStatus.find({
      binRequest: br._id,
    });

    const result = {
      ...br.toObject(),
      statusHistory,
    };
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateBinRequestStatus(req, res, next) {
  try {
    const data = req.body;
    const errors = validateStatus(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }
    const binRequests = await BinRequest.find({
      _id: { $in: data.binRequestIds },
      status: { $ne: BinRequest.STATUS_DRAFT },
    });
    binRequests.map(async (binRequest) => {
      const b = binRequest;
      await b.updateStatus(data.status);
    });
    return res.json(binRequests);
  } catch (err) {
    return next(err);
  }
}

async function prinQRCode(req, res, next) {
  try {
    let bins = await Bin.find({
      _id: { $in: req.body.ids },
    }).populate('binRequest')
      .populate('product')
      .populate('customer');


    const standardBins = bins.filter(b => b.product && !b.product.partnerDelivered); // filter out partner Delivery bin
    bins = await generateQRCodeAndSendDelivery(standardBins);

    res.json(bins);
  } catch (err) {
    next(err);
  }
}

async function updateBinRequest(req, res, next) {
  try {
    const binRequest = await BinRequest.findOne({
      _id: req.params.id,
      status: {
        $ne: BinRequest.STATUS_DRAFT,
      },
    }).populate('customer');
    if (!binRequest) {
      return next(notFoundExc('Order not found'));
    }

    const data = req.body;
    const errors = validateFormData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    if (data.status === BinRequest.STATUS_PENDING) {
      await binRequest.setDeliveryAddress(data.shippingAddress);
      await binRequest.save();
    }

    await binRequest.updateStatus(data.status);

    binRequest.courier = data.courier;
    await binRequest.save();
    return res.json(binRequest);
  } catch (err) {
    return next(err);
  }
}

async function updateBinCollectionStatus(req, res, next) {
  try {
    const { collectionRequestId, status } = req.body;
    const bin = await Bin.findById(req.params.id);

    const colReq = await CollectionRequest.findById(collectionRequestId);

    if (!colReq || !bin) {
      return next(notFoundExc('Bin not found'));
    }

    const colReqItem = colReq.items.find(item => item.bin.toString() === bin._id.toString());

    await bin.updateCollectionStatus(status);

    // save bin's status in this collection request
    colReqItem.binStatus = bin.collectionStatus;
    await colReq.save();

    return res.json(bin);
  } catch (err) {
    return next(err);
  }
}

async function updateBinDeliveryStatus(req, res, next) {
  try {
    const bin = await Bin.findOne({
      _id: req.params.id,
    }).populate('customer');
    if (!bin) {
      return next(notFoundExc('Order not found'));
    }
    const data = req.body;
    const errors = validateDeliveryStatus(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }
    // update its delivery status
    await bin.updateDeliveryStatus(data.status);
    return res.json(bin);
  } catch (err) {
    return next(err);
  }
}

async function importProductOrders(req, res, next) {
  try {
    const productOrders = new CSVRawData();
    /** Read file data */
    csv.fromPath(req.file.path).on('data', (data) => {
      productOrders.addProductOrder(data);
    }).on('end', async () => {
      /** Delete file */
      fs.unlinkSync(req.file.path);

      /** Validate data */
      const errors = await productOrders.validate();
      if (errors) {
        return next(validationExc('Please correct your file.', { errors }));
      }

      /** Persist data */
      const orders = productOrders.groupOrderByNumber();

      const newOrders = await Promise.all(Object.keys(orders).map(async (keyNumber) => {
        /** Get order by key */
        const order = orders[keyNumber];

        /** Create bin request */
        const newOrder = new BinRequest({
          items: [],
          customer: order.customer,
          status: BinRequest.STATUS_DRAFT,
          discountCodes: order.discountCode,
          createdAt: new Date(),
        });

        /** Save temp new order */
        await newOrder.save();

        /** Create list item */
        newOrder.items = await Promise.all(order.items.map(async (item) => {
          const price = await item.product.getProductPrice(order.customer);
          return {
            product: item.product.toProductObject(),
            quantity: item.quantity,
            price,
            total: price * item.quantity,
          };
        }));

        /** Update bin request */
        newOrder.code = await generateBinRequestCode();
        await newOrder.setDeliveryAddress(order.address);
        await newOrder.setPrices();
        // save request
        newOrder.estDeliveryAt = moment().add(2, 'days').toDate();

        await generateBinsForCustomer(newOrder);

        // save customer delivery address for later use
        await Address.findOneAndUpdate({
          user: order.customer._id,
          type: Address.TYPE_DELIVERY,
          address: newOrder.shippingAddress,
        }, {
          user: order.customer._id,
          type: Address.TYPE_DELIVERY,
          address: newOrder.shippingAddress,
        }, { upsert: true });

        /** Create history status */
        await newOrder.updateStatus(BinRequest.STATUS_PENDING);
        await newOrder.updateStatus(BinRequest.STATUS_IN_PROGRESS);
        await newOrder.updateStatus(BinRequest.STATUS_COMPLETED);

        /** Set binrequest to completed */
        newOrder.status = BinRequest.STATUS_COMPLETED;
        await newOrder.save();

        await newOrder.populate('bins').execPopulate();
        return newOrder.toObject();
      }));

      /** End process */
      res.setHeader('Content-disposition', 'attachment; filename=orders.pdf');
      res.setHeader('Content-type', 'application/octet-stream');
      const pdfFile = path.join(__dirname, 'orders.pdf');
      const doc = new PDFDocument({
        size: config.printSize,
        layout: 'landscape',
        margin: config.printMargin,
      });

      const writeStream = fs.createWriteStream(pdfFile);
      doc.pipe(writeStream);
      createPdf(doc, newOrders);
      doc.pipe(res);
      fs.unlinkSync(pdfFile);
      return doc.end();
    }).on('error', (error) => {
      /** Delete file */
      fs.unlinkSync(req.file.path);
      next(error);
    });
  } catch (err) {
    next(err);
  }
}

async function downloadQRCode(req, res, next) {
  try {
    let br = await BinRequest.findOne({
      _id: req.params.id,
      status: { $ne: BinRequest.STATUS_DRAFT },
    });

    if (!br) {
      return next(notFoundExc('Order not found'));
    }

    // generate qr code for each bins
    const bins = await Bin.find({
      _id: { $in: br.bins },
    }).populate('binRequest')
      .populate('product')
      .populate('customer');

    const standardBins = bins.filter(b => b.product && !b.product.partnerDelivered); // filter out partner Delivery bin
    await generateQRCodeAndSendDelivery(standardBins);

    // Retrive the binrequest also include bins
    br = await BinRequest.findById(req.params.id).populate('bins')
      .populate({
        path: 'bins',
        populate: {
          path: 'product',
        },
      });

    br.bins = br.bins.filter(b => b.product && !b.product.partnerDelivered); // filter out partner Delivery bin

    /** End process */
    const fileName = `${br.code}-qr-codes.pdf`;
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/octet-stream');
    const pdfFile = path.join(__dirname, fileName);
    const doc = new PDFDocument({
      size: config.printSize,
      layout: 'landscape',
      margin: config.printMargin,
    });

    const writeStream = fs.createWriteStream(pdfFile);
    doc.pipe(writeStream);
    drawQRCodeAsPdf(br, doc);
    doc.pipe(res);
    fs.unlinkSync(pdfFile);
    return doc.end();
  } catch (error) {
    return next(error);
  }
}

async function createBinRequest(req, res, next) {
  try {
    const data = req.body;
    const { validateBinRequest } = require('../../customer/bin-request/helpers');

    // if no _id field was submitted, create an empty bin request
    // and return its data
    if (!data._id) {
      const binRequest = new BinRequest({
        items: [],
        discountCodes: [],
        status: BinRequest.STATUS_DRAFT,
      });
      await binRequest.save();
      return res.json(binRequest.toObject());
    }

    // update bin request
    const binRequest = await BinRequest.findById(data._id);
    if (!binRequest) {
      return next(notFoundExc('Request not found'));
    }

    // update data
    binRequest.discountCodes = data.discountCodes || [];
    binRequest.comment = data.comment;
    binRequest.invoiceCode = data.invoiceCode;
    binRequest.courier = data.courier;
    binRequest.paymentType = data.paymentType;
    binRequest.enableNotification = data.enableNotification;
    binRequest.customer = data.customerId;
    binRequest.shippingAddressCouncilId = data.customer_no;
    binRequest.shippingAddressDivision = data.class_electoral_division;

    const customer = await User.findById(data.customerId);

    let foundInvalidProduct = false;
    binRequest.items = await Promise.all(data.items.map(async (item) => {
      const p = await Product.findById(item.product);

      // validate traditional skip product
      if (p.partnerDelivered) {
        const isValid = checkAvailableDeliveryDate(item.deliveryDate);
        if (!isValid) foundInvalidProduct = true;
      }
      if (foundInvalidProduct) return;

      // set product's unit price
      const price = await p.getProductPrice(customer);
      return {
        product: p._id,
        quantity: item.quantity,
        price,
        total: price * item.quantity,
        deliveryDate: item.deliveryDate,
      };
    }));

    if (foundInvalidProduct) return next(validationExc('Invalid Delivery date'));

    const geocodedAddress = await geocoding(data.shippingAddress);
    await binRequest.setDeliveryAddress(geocodedAddress.formatted_address);

    // implicit apply customer discount code
    const oldCodes = binRequest.discountCodes;
    await binRequest.addCustomerDiscount();

    // calculate prices base on current attributes
    await binRequest.setPrices();

    // apply one-off discounts
    const oneOffDiscounts = Array.isArray(data.oneOffDiscounts) ? data.oneOffDiscounts : [];
    const oneOffDscAmt = oneOffDiscounts.reduce((sum, discount) => {
      let amt = 0;
      switch (discount.type) {
        case 'flat':
          amt = discount.amount;
          break;
        case 'percentage':
          amt = (discount.amount * binRequest.total) / 100;
          break;
        default:
          break;
      }
      return amt;
    }, 0);
    binRequest.discount += oneOffDscAmt;
    binRequest.total = binRequest.total > oneOffDscAmt ? binRequest.total - oneOffDscAmt : 0;

    // validate bin request
    const errors = await validateBinRequest(binRequest, customer);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // revert discount code list
    binRequest.discountCodes = oldCodes;
    await binRequest.save();

    // publish request
    const { dryRun = '1' } = req.query;
    if (dryRun === '0') {
      await binRequest.publish();
    }
    return res.json(binRequest);
  } catch (err) {
    return next(err);
  }
}

async function updateBinRequestDeliveryStatus(req, res, next) {
  try {
    const binRequest = await BinRequest.findOne({
      _id: req.params.id,
      status: {
        $ne: BinRequest.STATUS_DRAFT,
      },
    });

    if (!binRequest) {
      return next(notFoundExc('Order not found'));
    }

    await binRequest
      .populate('bins')
      .execPopulate();
    const data = req.body;
    const errors = validateDeliveryStatus(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    binRequest.bins = await Promise.all(binRequest.bins.map(async (bin) => {
      await bin.updateDeliveryStatus(data.status);
      return bin;
    }));
    binRequest.save();
    return res.json(binRequest);
  } catch (err) {
    return next(err);
  }
}

async function exportBinRequestList(req, res, next) {
  try {
    const query = getQueryData(req.query, req.user._id);
    const rawData = await BinRequest.aggregate(query.pipelines);

    if (!rawData) {
      return next(notFoundExc('No matching results were found'));
    }

    const prodSheet = await loadGoogleSheetReport(config.productRequestSheetReport);

    await prodSheet.loadHeaderRow();
    const HEADER_ROW = prodSheet.headerValues;

    const binReqs = await Promise.all(rawData[0].data.map(async (item) => {
      const binReq = await BinRequest.findById(item._id)
        .populate('items.product')
        .populate('bins')
        .populate('customer');

      return binReq;
    }));

    const items = await mapProductReportDataToColumn(HEADER_ROW, binReqs);

    const csvStringifier = createCsvStringifier({
      header: HEADER_ROW.map(h => ({ id: h, title: h })),
    });
    const header = csvStringifier.getHeaderString();
    const content = csvStringifier.stringifyRecords(items);
    res.setHeader(
      'Content-disposition',
      'attachment; filename=product-report.csv',
    );
    res.set('Content-Type', 'text/csv');
    return res.send(`${header}${content}`);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getBinRequestList,
  getBinRequestDetail,
  updateBinRequestStatus,
  prinQRCode,
  updateBinRequest,
  importProductOrders,
  downloadQRCode,
  createBinRequest,
  updateBinDeliveryStatus,
  updateBinCollectionStatus,
  updateBinRequestDeliveryStatus,
  exportBinRequestList,
};
