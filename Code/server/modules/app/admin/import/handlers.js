const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const PDFDocument = require('pdfkit');
const config = require('../../../../config');
const Address = require('../../models/address');
const BinRequest = require('../../models/bin-request');

const CSVRawData = require('./models/product-order');
const { generateBinRequestCode } = require('../../helpers');
const { validationExc } = require('../../../common/helpers');
const { generateBinsForCustomer, createPdf } = require('./helpers');

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
        margin: config.printMargin
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

module.exports = {
  importProductOrders,
};
