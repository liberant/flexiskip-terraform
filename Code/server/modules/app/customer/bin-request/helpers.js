const validate = require('validate.js');
const BinRequest = require('../../models/bin-request');
const CouncilAddress = require('../../models/council-address');
const {
  PAYMENT_TYPE_STRIPE,
  PAYMENT_TYPE_INVOICE,
} = require('../../models/payment');
const Product = require('../../models/product');
const {
  validateDiscountCode,
  validateAustraliaAddress,
  validateInvoiceCode,
  validateInvoicePaymentMethod,
} = require('../../helpers');

async function validateProduct(productId, { customer }) {
  // check if product exists
  const product = await Product.findOne({
    _id: productId,
    status: { $ne: Product.STATUS_REMOVED },
  });
  if (!product) {
    return Promise.resolve('must exists');
  }

  if (product.type === Product.TYPE_COUNCIL) {
    // check if customer belong to product's council
    if (product.council.toString() !== customer.council.toString()) {
      return Promise.resolve('is not available in your council');
    }

    // check product's available time range
    const now = new Date();
    const startDate = new Date(product.startDate);
    const endDate = new Date(product.endDate);
    if (!(startDate <= now && endDate >= now)) {
      return Promise.resolve('is not available at the moment');
    }

    // available ordered amount for this customer address > 0
    // ...
  }
  return Promise.resolve();
}

async function validateCartItems(items, { allowEmpty, customer }) {
  if (items === undefined || !items.length) {
    return allowEmpty ? Promise.resolve() : Promise.resolve('must not be empty');
  }

  const constraints = {
    quantity: {
      numericality: { greaterThan: 0 },
    },
    product: {
      validateProduct: { customer },
    },
  };

  let error = '';
  try {
    validate.validators.validateProduct = validateProduct;
    await Promise.all(items.map(item => validate.async(item, constraints, { format: 'flat' })));
  } catch (arrErrors) {
    error = `is invalid: ${arrErrors.join(', ')}`;
  }

  return Promise.resolve(error);
}

async function validateBinRequest(cart, customer) {
  let errors;
  const constraints = {
    customer: {
      presence: { allowEmpty: false },
    },
    discountCodes: {
      validateDiscountCode: { order: cart, requestType: 'bin' },
    },
    items: {
      validateCartItems: { allowEmpty: false, customer },
    },
    // temporary set allowEmpty to false
    // will enable it in version 1.7
    shippingAddress: {
      deliveryAddress: { allowEmpty: true },
    },
    paymentType: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [
          PAYMENT_TYPE_STRIPE,
          PAYMENT_TYPE_INVOICE,
        ],
        message: 'is not allowed',
      },
      validateInvoicePaymentMethod: { order: cart },
    },
    invoiceCode: {
      validateInvoiceCode: { order: cart },
    },
  };
  validate.validators.validateDiscountCode = validateDiscountCode;
  validate.validators.validateCartItems = validateCartItems;
  validate.validators.deliveryAddress = validateAustraliaAddress;
  validate.validators.validateInvoiceCode = validateInvoiceCode;
  validate.validators.validateInvoicePaymentMethod = validateInvoicePaymentMethod;

  try {
    await validate.async(cart.toObject(), constraints, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

function getQueryData({ limit = 10, page = 1 }, userId) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    customer: userId,
    status: {
      $ne: BinRequest.STATUS_DRAFT,
    },
  };

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    conditions,
    limit: limit2,
    page,
    offset,
  };
}

async function canOrderCouncilProduct(customer) {
  // find all council product
  const products = await Product.find({
    type: Product.TYPE_COUNCIL,
    council: customer.council,
    startDate: { $lt: new Date() },
    endDate: { $gt: new Date() },
  });
  if (products.length === 0) {
    return false;
  }

  const address = await customer.getAddress();
  // check if there are any products are available for customer
  return products.some((product) => {
    if (product.usedTimes.length === 0) {
      return true;
    }
    const notAvailable = product.usedTimes.some(used =>
      used.address === address
      && used.quantity >= product.qtyPerAddress);
    return !notAvailable;
  });
}

async function getProductsByType(wasteType, customer, address) {
  let conditions = {
    status: { $nin: [Product.STATUS_REMOVED, Product.STATUS_UNAVAILABLE] },
    council: { $exists: false },
    wasteType,
  };

  if (wasteType === 'Council Skip') {
    const councilAddr = await CouncilAddress.findOne({ fullAddress: address });
    if (councilAddr) {
      conditions = {
        status: { $nin: [Product.STATUS_REMOVED, Product.STATUS_UNAVAILABLE] },
        council: councilAddr.council,
      };
    }
    // exclude purchased council product
    const purchasedProducts = await BinRequest.aggregate([
      { $unwind: '$items' },
      { $project: { product: '$items.product' } },
    ]);
    conditions._id = { $nin: purchasedProducts.map(item => item.product) };
  }

  const products = await Product.find(conditions);
  const items = await Promise.all(products.map(async (p) => {
    const prodPrice = await p.getProductPrice(customer);
    const colPrice = await p.getCollectionPrice(customer, address);
    return {
      ...p.toProductObject(),
      price: prodPrice,
      estPrice: prodPrice + colPrice,
    };
  }));
  return items;
}

module.exports = {
  getQueryData,
  validateBinRequest,
  canOrderCouncilProduct,
  getProductsByType,
};
