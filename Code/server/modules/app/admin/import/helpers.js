
const Bin = require('../../models/bin');
const Product = require('../../models/product');
const { generateQRCode } = require('../../../common/helpers');

/* eslint no-buffer-constructor: 0 */

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

function createPdf(doc, newOrders) {
  newOrders.forEach((order) => {
    if (order.bins) {
      let c = order.bins.length;
      order.bins.forEach((bin) => {
        const centerX = (doc.page.width - 200) / 2;
        /** Add qr code */
        const buffer = new Buffer(bin.qrCodeImage.replace('data:image/png;base64,', ''), 'base64');
        doc.image(buffer, (doc.page.width - 100) / 2, 20, {
          fit: [100, 100],
          align: 'center',
          valign: 'center',
        });
        /** Bin Code */
        doc.fontSize(20)
          .text(bin.code, centerX, 120, {
            width: 200,
            align: 'center',
            valign: 'center',
          });
        /** Product name */
        doc.fontSize(18)
          .text(bin.name, centerX, 140, {
            width: 200,
            align: 'center',
            valign: 'center',
          });
        /** BinRequest code */
        doc.fontSize(20)
          .text(order.code, centerX, 160, {
            width: 200,
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
  });
}

module.exports = {
  generateBinsForCustomer,
  createPdf,
};
