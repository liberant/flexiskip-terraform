const moment = require('moment');
const ms = require('ms');
const axios = require('axios');
const validate = require('validate.js');
const User = require('../models/user');
const BinRequest = require('../models/bin-request');
const CollectionRequest = require('../models/collection-request');
const Bin = require('../models/bin');
const Product = require('../models/product');
const CouncilAddress = require('../models/council-address');
const Council = require('../models/council');

const { PAYMENT_TYPE_INVOICE, PAYMENT_TYPE_STRIPE } = require('../models/payment');
const stripeCreateCustomer = require('../../common/payment').createCustomer;
const { getPaymentIntent } = require('../../common/payment');
const { validationExc, buildQuery } = require('../../common/helpers');
const {
  parseAddress,
  geocoding,
} = require('../../common/shipping');
const { generateCollectionRequestCode } = require('../helpers');
const createMiddleware = require('../../common/jwt');

const { collectionLifeTime, googleApiKey, gcProductIds } = require('../../../config');
const helper = require('./helpers');
const { sendCustomerNewCollectionReq } = require('../helpers/email')
const _ = require('lodash');


const BRISBANE_COUNCIL_CODE = 'Brisbane-City-Council';


async function getAddresses(req, res, next) {
  try {
    const { input } = req.query;
    const query = buildQuery({
      input,
      key: googleApiKey,
      types: 'address',
      components: 'country:au',
    });
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${query}`;
    const resp = await axios.get(url);
    // console.log(url);
    const data = resp.data.predictions || [];
    const results = data.filter(item => (item.description || '').indexOf('QLD') > -1);
    return res.json(results);
  } catch (error) {
    return next(error);
  }
}

async function getProductsByAddress(req, res, next) {
  try {
    const { address } = req.query;
    const products = await helper.getProductsByAddress(address);
    return res.json(products);
  } catch (err) {
    return next(err);
  }
}

async function getProductsForBrisbaneCity(req, res, next) {
  try {
    const { address } = req.query;
    if (!address) {
      throw validationExc('Address is required.');
    }

    const { postalCode } = await parseAddress(address);

    const council = await Council.findOne({
      code: BRISBANE_COUNCIL_CODE,
      postCodes: postalCode,
    });

    if (!council) {
      throw validationExc(
        'Your address is not allowed for purchasing council product.',
        'purchase/invalid_address',
      );
    }

    console.log(council._id);

    let products = await Product.find({
      council: council._id,
      // residentialPrice: {
      //   $lte: 0,
      // },
      // businessPrice: {
      //   $lte: 0,
      // },
    });

    console.log(products);
    // exclude purchased product
    const excludeds = await Promise.all(products.map(async (product) => {
      const geocodedAddress = await geocoding(address);

      const orderExists = await BinRequest.countDocuments({
        shippingAddress: geocodedAddress.formatted_address,
        'items.product': product._id,
      });
      return !orderExists;
    }));

    products = products.map((product, index) => {
      product = product.toProductObject();
      product.available = excludeds[index];
      return product;
    });

    return res.json(products);
  } catch (err) {
    return next(err);
  }
}


async function checkProductValidForBrisbane(address, product) {
  const geocodedAddress = await geocoding(address);
  // check if this address already purchased the product
  const orderExists = await BinRequest.countDocuments({
    shippingAddress: geocodedAddress.formatted_address,
    'items.product': product,
  });
  if (orderExists) {
    throw validationExc(
      'This address already purchase this product',
      null,
      'purchase/product_already_purchased',
    );
  }

  // // check if this product is available for purchase in this council
  // const councilAddr = await CouncilAddress.findOne({ fullAddress: address });
  // if (!councilAddr) {
  //   throw validationExc(
  //     'Address is not allowed for purchasing council product.',
  //     'purchase/invalid_address',
  //   );
  // }

  const { postalCode } = await parseAddress(address);

  const council = await Council.findOne({
    code: BRISBANE_COUNCIL_CODE,
    postCodes: postalCode,
  });

  if (!council) {
    throw validationExc(
      'Your address is not allowed for purchasing council product.',
      'purchase/invalid_address',
    );
  }

  const prod = await Product.findById(product);
  const isProductAvailable =
    council._id.toString() === prod.council.toString();
  if (!isProductAvailable) {
    throw validationExc(
      'This product is not available in your council',
      null,
      'purchase/product_unavailable',
    );
  }
}


// check if an address can purchase a product
// throw exception if check failed
async function checkProductValidForPurchase(address, product) {
  const geocodedAddress = await geocoding(address);
  // check if this address already purchased the product
  const orderExists = await BinRequest.countDocuments({
    shippingAddress: geocodedAddress.formatted_address,
    'items.product': product,
  });
  if (orderExists) {
    throw validationExc('This address already purchase this product', null, 'purchase/product_already_purchased');
  }

  // check if this product is available for purchase in this council
  const councilAddr = await CouncilAddress.findOne({ fullAddress: address });
  if (!councilAddr) {
    throw validationExc('Address is not allowed for purchasing council product.', 'purchase/invalid_address');
  }
  const prod = await Product.findById(product);
  const isProductAvailable = councilAddr.council.toString() === prod.council.toString();
  if (!isProductAvailable) {
    throw validationExc('This product is not available in your council', null, 'purchase/product_unavailable');
  }
}

async function createCustomer(req, res, next) {
  try {
    const input = req.body;

    // validate client input
    validate.Promise = global.Promise;
    validate.validators.productExists = async (value) => {
      const product = await Product.findOne({
        _id: value,
        status: { $nin: [Product.STATUS_REMOVED, Product.STATUS_UNAVAILABLE] },
        council: { $exists: true },
      });
      return product
        ? Promise.resolve()
        : Promise.resolve('is not available.');
    };
    const constraints = {
      email: {
        presence: { allowEmpty: false },
        email: true,
      },
      firstname: {
        presence: { allowEmpty: false },
      },
      lastname: {
        presence: { allowEmpty: false },
      },
      phone: {
        presence: { allowEmpty: false },
      },
      address: {
        presence: { allowEmpty: false },
      },
      product: {
        presence: { allowEmpty: false },
        productExists: true,
      },
    };
    let errors;
    try {
      await validate.async(input, constraints, { format: 'grouped' });
    } catch (err) {
      errors = err;
    }
    if (errors) {
      throw validationExc('Invalid purchase data', errors);
    }

    // check if an address can purchase a product
    if (input && input.userFrom === 'bcc') {
      await checkProductValidForBrisbane(input.address, input.product);
    } else {
      await checkProductValidForPurchase(input.address, input.product);
    }

    // create customer account for this purchase
    let customer = await User.findOne({ email: input.email });
    if (!customer) {
      const councilAddr = await CouncilAddress.findOne({ fullAddress: input.address });
      const geocodedAddress = await geocoding(input.address);

      // create stripe customer
      const stripeCustomer = await stripeCreateCustomer(input.email, 'Flexiskip Customer');

      customer = new User({
        email: input.email,
        status: User.STATUS_ACTIVE,
        roles: User.ROLE_RES_CUSTOMER,
        council: councilAddr.council,
        firstname: input.firstname,
        lastname: input.lastname,
        phone: input.phone,
        residentialCustomerProfile: {
          address: geocodedAddress.formatted_address,
          payment: {
            stripeCustomerId: stripeCustomer.id,
            cardLast4Digits: null,
          },
        },
      });
      await customer.save();
    }

    return res.json(customer);
  } catch (err) {
    return next(err);
  }
}

async function createBinRequest(req, res, next) {
  try {
    const input = req.body;
    const customerId = req.user && req.user._id;

    // validate client input
    validate.Promise = global.Promise;
    validate.validators.productExists = async (value) => {
      const products = await helper.getProductsByAddress(input.address);
      const foundProduct = products.find(p => p._id == value);
      return foundProduct && foundProduct.available && foundProduct.gccAvailable
        ? Promise.resolve()
        : Promise.resolve('is not available.');
    };

    const constraints = {
      product: {
        presence: { allowEmpty: false },
        productExists: true,
      },
      address: {
        presence: { allowEmpty: false },
      },
    };
    let errors;
    try {
      await validate.async(input, constraints, { format: 'grouped' });
    } catch (err) {
      errors = err;
    }
    if (errors) {
      throw validationExc('Invalid purchase data', errors);
    }

    // check if an address can purchase a product
    if (input && input.userFrom === 'bcc') {
      await checkProductValidForBrisbane(input.address, input.product);
    } else {
      await checkProductValidForPurchase(input.address, input.product);
    }

    // save new order
    const customer = await User.findById(customerId);
    const p = await Product.findById(input.product);
    const price = await p.getProductPrice(customer);
    const binRequest = new BinRequest({
      comment: input.comment,
      customer: customerId,
      shippingAddressCouncilId: input.customer_no,
      shippingAddressDivision: input.class_electoral_division,
      courier: BinRequest.COURIER_FASTWAY,
      paymentType: PAYMENT_TYPE_STRIPE,
      paid: false,
      items: [{
        product: p._id,
        quantity: 1,
        price,
        total: price,
      }],
    });

    // geocoding run
    const geocodedAddress = await geocoding(input.address);
    await binRequest.setDeliveryAddress(geocodedAddress.formatted_address);
    await binRequest.setPrices();
    await binRequest.publish();
    return res.json(binRequest);
  } catch (err) {
    return next(err);
  }
}

async function createCollectionRequest(req, res, next) {
  try {
    const input = req.body;
    const customerId = req.user && req.user._id;

    // validate client input
    validate.Promise = global.Promise;
    validate.validators.qrCodeExists = async (value) => {
      const bin = await Bin.findOne({
        code: value,
        customer: customerId,
      });

      if (bin && bin.isOrderable()) return Promise.resolve();
      return Promise.resolve('is invalid.');
    };
    const constraints = {
      address: {
        presence: { allowEmpty: false },
      },
      qrCode: {
        presence: { allowEmpty: false },
        qrCodeExists: true,
      },
    };
    let errors;
    try {
      await validate.async(input, constraints, { format: 'grouped' });
    } catch (err) {
      errors = err;
    }
    if (errors) {
      throw validationExc('Invalid purchase data', errors);
    }


    // create collection request
    const customer = req.user;
    const bin = await Bin.findOne({ code: input.qrCode });
    const product = await Product.findById(bin.product);

    let paymentIntent, price;

    if (input.paymentIntentId) {
      paymentIntent = await getPaymentIntent(input.paymentIntentId);
      price = _.round(paymentIntent.amount/100, 2);
    } else {
      price = await product.getCollectionPrice(customer, input.address);
    }

    const colReq = new CollectionRequest({
      customer: customer._id,
      paymentType: PAYMENT_TYPE_STRIPE,
      paid: true,
      additionalChargePaymentIntentId: input.paymentIntentId,
      // collectionAddressCouncilId: input.addressCouncilId,
      // collectionAddressDivision: input.addressDivision,
      items: [
        {
          bin: bin._id,
          product: bin.product,
          quantity: 1,
          price,
          total: price,
        },
      ],
    });

    // update customer payment details in db && CR price
    if (input.paymentIntentId) {
      const newDigits = paymentIntent.charges.data[0].payment_method_details.card.last4;
      customer.residentialCustomerProfile.payment.cardLast4Digits = newDigits;
      await customer.save();
    }

    await colReq.setPrices();

    const geocodedAddress = await geocoding(input.address);
    await colReq.setCollectionAddress(geocodedAddress.formatted_address);
    colReq.code = await generateCollectionRequestCode();
    colReq.createdAt = new Date();
    colReq.collectBy = moment().add(ms(collectionLifeTime), 'milliseconds').toDate();
    const { location } = await parseAddress(colReq.collectionAddress);
    colReq.collectionLocation.coordinates = [location.lng, location.lat];
    await colReq.updateStatus(CollectionRequest.STATUS_REQUESTED);

    // update data for every bins
    bin.collectionRequest = colReq._id;
    bin.collectionStatus = Bin.STATUS_REQUESTED;
    colReq.items[0].binStatus = bin.collectionStatus;
    bin.save();
    await colReq.save();
    colReq.broadcastColReqToDrivers();
    const user = await User.findById(customerId);
    if (user) { await sendCustomerNewCollectionReq(user, 'gc') }
    return res.json(colReq.toObject());
  } catch (err) {
    return next(err);
  }
}

async function getDeliveredBins(req, res, next) {
  try {
    const userId = req.user._id;
    const binRequests = await BinRequest.find({
      customer: userId,
      status: {
        $nin: [ BinRequest.STATUS_DRAFT, BinRequest.STATUS_CANCELLED ]
      },
    })
    .populate({
      path: 'bins',
      populate: {
        path: 'collectionRequest',
        select: { _id: 1 },
      }
    });
    let bins = [];

    // grouping bin requests by date
    binRequests.forEach(br => {
      if (br.bins.length) {
        let deliveredBins = br.bins.filter(b => b.status === Bin.STATUS_DELIVERED && !b.collectionRequest)
        deliveredBins = deliveredBins.map(b => {
          if (!br.shippingAddressCouncilId) {
            return {
              _id: b._id,
              images: b.images,
              name: b.name,
              status: b.status,
              code: b.code,
              shippingAddress: br.shippingAddress,
              price: b.price,
            };
          }
          if (br.shippingAddressCouncilId){
          const gcPrice = b.getGCPrice();
          return {
            _id: b._id,
            images: b.images,
            name: b.name,
            status: b.status,
            code: b.code,
            shippingAddressCouncilId: br.shippingAddressCouncilId,
            shippingAddressDivision: br.shippingAddressDivision,
            shippingAddress: br.shippingAddress,
            isGCExpired: gcPrice > 0,
            price: gcPrice,
          };
        }});
        bins = bins.concat(deliveredBins);
      }
    });

    return res.json(bins);
  } catch (err) {
    return next(err);
  }
}

const checkUserAuthenticated = createMiddleware(
  'jwtResCustomer',
  jwtPayload => User.findOne({
    _id: jwtPayload.userId,
    roles: User.ROLE_RES_CUSTOMER,
    status: User.STATUS_ACTIVE,
  }),
);

module.exports = {
  getProductsByAddress,
  createCustomer,
  createBinRequest,
  createCollectionRequest,
  getProductsForBrisbaneCity,
  getAddresses,
  checkUserAuthenticated,
  getDeliveredBins
};
