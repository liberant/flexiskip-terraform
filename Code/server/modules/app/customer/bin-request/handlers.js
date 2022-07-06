const BinRequest = require('../../models/bin-request');
const Product = require('../../models/product');
const WasteType = require('../../models/waste-type');
const { PAYMENT_TYPE_STRIPE } = require('../../models/payment');
const {
  validationExc,
  notFoundExc,
  getDatePart,
  checkAvailableDeliveryDate,
} = require('../../../common/helpers');
const {
  getQueryData,
  validateBinRequest,
  getProductsByType,
} = require('./helpers');

// get all product types
async function getProductTypes(req, res, next) {
  try {
    const customer = req.user;
    const types = await WasteType.find();
    types.unshift({
      _id: 'Council',
      image: 'https://handel-prod-storage.s3-website-us-east-1.amazonaws.com/category/council.jpg',
      name: 'Council Skip',
    });

    // loop through all categories and fetch products
    let items = await Promise.all(types.map(async (type) => {
      const item = type.toObject ? type.toObject() : type;
      item.products = await getProductsByType(type.name, customer, req.query.address);
      return item;
    }));

    // remove categories that have no products
    items = items.filter(item => item.products.length > 0);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createCart(req, res, next) {
  try {
    const cart = new BinRequest({
      items: [],
      customer: req.user._id,
      status: BinRequest.STATUS_DRAFT,
      paymentType: PAYMENT_TYPE_STRIPE,
    });
    await cart.save();
    return res.json(cart.toObject());
  } catch (err) {
    return next(err);
  }
}

async function updateCart(req, res, next) {
  try {
    const data = { items: [], ...req.body };
    const cart = await BinRequest.findOne({
      _id: req.params.cartId,
      customer: req.user._id,
      status: BinRequest.STATUS_DRAFT,
    });
    if (!cart) {
      return next(notFoundExc('Cart not found'));
    }

    // update cart's data
    cart.items = await Promise.all(data.items.map(async (item) => {
      const p = await Product.findById(item.product);
      if (item.productCode === 'H0043') {
        item.quantity = 1
      }
      // set product's unit price
      const price = await p.getProductPrice(req.user);
      return {
        product: p.toProductObject(),
        quantity: item.quantity,
        price,
        total: price * item.quantity,
        deliveryDate: item.deliveryDate,
      };
    }));

    cart.discountCodes = data.discountCodes || [];
    cart.comment = data.comment;
    cart.paymentType = data.paymentType;
    cart.invoiceCode = data.invoiceCode;
    await cart.setDeliveryAddress(data.shippingAddress);

    // implicit apply customer discount code
    const oldCodes = cart.discountCodes;
    await cart.addCustomerDiscount();

    // calculate prices base on current attributes
    await cart.setPrices();

    // validate cart
    const errors = await validateBinRequest(cart, req.user);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // revert discount code list
    cart.discountCodes = oldCodes;
    await cart.save();

    await cart.populate('items.product').execPopulate();
    return res.json(cart);
  } catch (err) {
    return next(err);
  }
}

async function getCartDetail(req, res, next) {
  try {
    const cart = await BinRequest.findOne({
      _id: req.params.cartId,
      customer: req.user._id,
      status: BinRequest.STATUS_DRAFT,
    });

    if (!cart) {
      return next(notFoundExc('Cart not found'));
    }

    await cart.populate('items.product').execPopulate();
    return res.json(cart);
  } catch (err) {
    return next(err);
  }
}

async function createBinRequest(req, res, next) {
  try {
    const customer = req.user;
    const data = req.body;


    // check request exist
    const binRequest = await BinRequest.findOne({
      _id: req.body.cartId,
      customer: customer._id,
      status: BinRequest.STATUS_DRAFT,
    });
    if (!binRequest) {
      return next(notFoundExc('Request not found'));
    }


    let foundInvalidProduct = false;
    let outdatedAppRequest  = false; // check outdated customer mobile app version for traditional skip order
    binRequest.items = await Promise.all(binRequest.items.map(async (item) => {
      const p = await Product.findById(item.product);
      if (item.productCode === 'H0043') {
        item.quantity = 1;
      }
      // validate traditional skip product
      if (p.partnerDelivered){
        if (data.items) {
          const deliveryData = data.items.find(i => i.product == item.product);
          if (!deliveryData) {
            foundInvalidProduct = true;
          } else {
            const { deliveryDate } = deliveryData;
            let isValid = checkAvailableDeliveryDate(deliveryDate);
            if (!isValid) foundInvalidProduct = true;
            else item.deliveryDate = deliveryDate;
          }
        } else {
          outdatedAppRequest = true;
        }
      }
      if (foundInvalidProduct) return
      if (outdatedAppRequest) return

      return item;
    }));

    if (outdatedAppRequest) return next(validationExc('Your app is currently out of date', undefined, undefined, {description: "Please update your app to the latest version to continue with this order."}));
    if (foundInvalidProduct) return next(validationExc('Invalid Delivery date'));
    await binRequest.save();

    // validate bin request
    const errors = await validateBinRequest(binRequest, customer);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // create a new bin request
    binRequest.courier = BinRequest.COURIER_FASTWAY;
    await binRequest.publish();

    // return data
    await binRequest.populate('bins').execPopulate();
    return res.json(binRequest.toObject());
  } catch (err) {
    if (err.message === 'Your card was declined.') {
      err.code = 'card_declined';
      err.message = 'I’m sorry!';
      err.description = 'Your card has been declined. Please check your card details are correct before trying again!';
    }
    return next(err);
  }
}

async function getBinRequests(req, res, next) {
  try {
    const query = getQueryData(req.query, req.user._id);
    const total = await BinRequest.countDocuments(query.conditions);
    const binRequests = await BinRequest.find(query.conditions)
      .sort({ _id: -1 })
      .skip(query.offset)
      .limit(query.limit)
      .populate('bins');
    const result = [];

    // grouping bin requests by date
    await Promise.all(binRequests.map(br => br.populate('items.product').execPopulate()));
    binRequests.forEach((binRequest) => {
      if (binRequest.items.length > 0) {
        const key = getDatePart(binRequest.createdAt);
        let item = result.find(i => i.date === key);
        if (!item) {
          item = {
            data: [],
            date: key,
          };
          result.push(item);
        }
        item.data.push(binRequest);
      }
    });
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
  getProductTypes,
  createCart,
  getCartDetail,
  updateCart,
  getBinRequests,
  createBinRequest,
};
