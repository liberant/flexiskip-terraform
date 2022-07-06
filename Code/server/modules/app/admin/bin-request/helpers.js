const validate = require('validate.js');
const moment = require('moment');
const Product = require('../../models/product');
const Bin = require('../../models/bin');
const BinRequest = require('../../models/bin-request');
const Promise = require('bluebird');
const {
  parseAddress,
  estimate,
  addConsignment,
  registerNotification,
  requestPickup,
} = require('../../../common/shipping');
const { escapeRegExp } = require('../../../common/helpers');
const config = require('../../../../config');
const { generateQRCode } = require('../../../common/helpers');
const {
  simulateFastwayProcess,
} = require('../../helpers');

/* eslint no-buffer-constructor: 0 */

function getQueryData({
  limit = 10, page = 1, s, status = '', partnerDelivered
}) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const match = {
    status: { $ne: BinRequest.STATUS_DRAFT },
  };

  if (s) {
    match.$or = [
      { code: new RegExp('^' + escapeRegExp(s), 'i') },
      { code: new RegExp('^' + escapeRegExp('br' + s), 'i') },
      { 'customer.fullname': new RegExp(escapeRegExp(s), 'i') },
      { 'customer.phone': new RegExp('^' + escapeRegExp(s), 'i') },
    ];
  }

  if (status) {
    const statusOr = [];
    const arrayStatus = status.split(',');
    arrayStatus.forEach((st) => {
      statusOr.push({
        status: new RegExp(escapeRegExp(st), 'i'),
      });
    });
    match.$and = [{
      $or: statusOr,
    }];
  }

  let binLookup = {
    $lookup: {
      from: 'bins',
      localField: 'bins',
      foreignField: '_id',
      as: 'bins',
    }
  }


  if (["true", "false"].includes(partnerDelivered)) {
    binLookup = {
      $lookup: {
        from: 'bins',
        let: { "bin_request_id": "$_id" },
        pipeline: [
         { $match:{ $expr: { $eq: ["$binRequest", "$$bin_request_id"] } } },
         { $lookup: {
           from: 'products',
           let: { 'product_id': '$product' },
           pipeline: [
             { $match: { $expr: { $eq: [ '$_id', '$$product_id'] } } },
           ],
           as: 'product'
         }}
        ],
        as: 'bins',
      },
    };

    if (partnerDelivered == "true") match["bins.product"] = {$elemMatch : { partnerDelivered: true } };
    else if (partnerDelivered == "false") match["bins.product"] = {$elemMatch : { partnerDelivered: { $ne: true } } };
  }

  // calculate offset
  const offset = (page2 - 1) * limit2;

  const pipelines = [
    binLookup,
    {
      $lookup: {
        from: 'users',
        localField: 'bins.customer',
        foreignField: '_id',
        as: 'customer',
      },
    },
    {
      $match: match,
    },
    {
      $facet: {
        total: [{ $count: "count" }],
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: offset },
          { $limit: limit2 },
        ],
      }
    }
  ];

  return {
    pipelines,
    limit: limit2,
    page,
    offset,
  };
}

function validateStatus(data) {
  const rules = {
    binRequestIds: {
      presence: true,
    },
    status: {
      presence: true,
      inclusion: {
        within: [
          BinRequest.STATUS_PENDING,
          BinRequest.STATUS_IN_PROGRESS,
          BinRequest.STATUS_COMPLETED,
          BinRequest.STATUS_CANCELLED,
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

async function sendPickupRequestToFastway(bin) {
  const { binRequest } = bin;
  const { customer } = bin;

  // source address
  const pickupAddress = config.productWareHouseAddress;

  // parse the destination address
  const deliveryAddress = binRequest.shippingAddress;
  const {
    suburb: deliverySuburb,
    postalCode: deliveryPostcode,
  } = await parseAddress(deliveryAddress);

  // retrieve fastway label for making shipment
  const label = await addConsignment({
    AccountNo: customer.uId,
    ContactEmail: customer.email,
    ContactName: `${customer.firstname} ${customer.lastname}`,
    Address1: deliveryAddress,
    Suburb: deliverySuburb,
    Postcode: deliveryPostcode,
    'Items[0].Weight': bin.weight,
    'Items[0].Reference': bin.code,
    'Items[0].Packaging': 1,
    'Items[0].Quantity': 1,
    SpecialInstruction1: `${bin.code} - ${binRequest.code}`,
    SpecialInstruction2: binRequest.comment,
  });

  // Register a label number to receive automatic updates when new scan events are processed
  await registerNotification(label);

  // if in production environment, send pickup request to Fastway
  if (process.env.NODE_ENV === 'production') {
    const pickupDate = moment().add(1, 'days').format('DD/MM/YYYY');
    const {
      suburb: pickupSuburb,
      postalCode: pickupPostcode,
    } = await parseAddress(pickupAddress);
    await requestPickup({
      LabelNumber: label,
      quantity: 1,
      countrycode: 1,
      PickupStreet: pickupAddress,
      PickupSuburb: pickupSuburb,
      PickupPostalCode: pickupPostcode,
      PickupDate: pickupDate,
      DeliveryName: `${customer.firstname} ${customer.lastname}`,
      RequirePrint: false,
    });
  }

  // get estimated delivery time
  const { days } = await estimate(
    pickupAddress,
    binRequest.shippingAddress,
    bin.weight,
  );

  return { label, days };
}

function validateFormData(data) {
  const rules = {
    status: {
      presence: true,
      inclusion: {
        within: [
          BinRequest.STATUS_PENDING,
          BinRequest.STATUS_IN_PROGRESS,
          BinRequest.STATUS_COMPLETED,
          BinRequest.STATUS_CANCELLED,
        ],
        message: 'is not allowed',
      },
    },
    courier: {
      presence: true,
      inclusion: {
        within: [
          BinRequest.COURIER_FASTWAY,
          BinRequest.COURIER_OTHER,
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

function validateDeliveryStatus(data) {
  const rules = {
    status: {
      presence: true,
      inclusion: {
        within: [
          Bin.STATUS_PENDING,
          Bin.STATUS_READY,
          Bin.STATUS_DISPATCHED,
          Bin.STATUS_DELIVERED,
          Bin.STATUS_CANCELLED,
        ],
        message: 'is not allowed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

async function saveBin(item, binRequest, product) {
  const { customer } = binRequest;
  const {
    _id,
    createdAt,
    updatedAt,
    comment,
    status,
    ...data
  } = product.toObject();

  // generate qr code for each bins
  const qrCodeImage = await generateQRCode(data.code);

  const bin = new Bin({
    ...data,
    code: null,
    productCode: data.code,
    productName: data.name,
    images: product.getImages(),
    customer: customer._id,
    product: product._id,
    binRequest: binRequest._id,
    status: Bin.STATUS_DELIVERED,
    qrCodeImage,
    price: item.price,
  });
  await bin.save();
  return bin;
}

async function generateBinsForCustomer(binRequest) {
  const promises = [];
  await Promise.all(binRequest.items.map(async (item) => {
    const product = await Product.findById(item.product);

    // generate bins for customer
    for (let i = 0; i < item.quantity; i += 1) {
      promises.push(saveBin(item, binRequest, product));
    }
  }));

  // update bin request bins list
  const bins = await Promise.all(promises);
  const bnReq = binRequest;
  bnReq.bins = bins.map(bin => bin._id);
  return bnReq.save();
}

function drawQRCodeAsPdf(order, doc) {
  const textWidth = 200;
  const imageWidth = 100;
  if (order.bins) {
    let c = order.bins.length;
    order.bins.forEach((bin) => {
      const centerTextX = (doc.page.width - textWidth) / 2;
      const centerImageX = (doc.page.width - imageWidth) / 2;
      /** Add qr code */
      const buffer = new Buffer(bin.qrCodeImage.replace('data:image/png;base64,', ''), 'base64');
      doc.image(buffer, centerImageX, 20, {
        fit: [imageWidth, imageWidth],
        align: 'center',
        valign: 'center',
      });
      /** Bin Code */
      doc.fontSize(20)
        .text(bin.code, centerTextX, 120, {
          width: textWidth,
          align: 'center',
          valign: 'center',
        });
      /** Product name */
      doc.fontSize(18)
        .text(bin.name, centerTextX, 140, {
          width: textWidth,
          align: 'center',
          valign: 'center',
        });
      /** BinRequest code */
      doc.fontSize(20)
        .text(order.code, centerTextX, 160, {
          width: textWidth,
          align: 'center',
          valign: 'center',
        });
      if (c > 1) {
        doc.addPage();
        // eslint-disable-next-line no-plusplus
        c--;
      }
    });
  }
}

function createPdf(doc, newOrders) {
  newOrders.forEach((order) => {
    drawQRCodeAsPdf(order, doc);
  });
}

async function generateQRCodeAndSendDelivery(bins) {
  // generate qr code for each bins
  bins = await Promise.all(bins.map(async (bin) => {
    if (bin.qrCodeImage) return bin;
    const b = bin;
    // generate QR code for this bin
    b.qrCodeImage = await generateQRCode(b.code);
    return b.save();
  }));

  bins = await Promise.each(bins, async (bin) => {
    // send pickup request to Fastway for each bins
    if (bin.binRequest.courier === BinRequest.COURIER_FASTWAY) {
      if (bin.status !== Bin.STATUS_PENDING) return bin;

      const b = bin;
      // send a pickup request for this bin to Fastway Courier
      const {
        label,
        days,
      } = await sendPickupRequestToFastway(b);
      b.fastwayLabel = label;
      b.fastwayEstDays = days;

      // update its status to Ready and send notification to customer
      await b.updateDeliveryStatus(Bin.STATUS_READY);
      if (process.env.NODE_ENV !== 'production') {
        simulateFastwayProcess(b);
      }
      return b;
    }
    return bin;
  });
  return bins;
}

module.exports = {
  getQueryData,
  validateStatus,
  sendPickupRequestToFastway,
  validateFormData,
  validateDeliveryStatus,
  generateBinsForCustomer,
  createPdf,
  drawQRCodeAsPdf,
  generateQRCodeAndSendDelivery,
};
