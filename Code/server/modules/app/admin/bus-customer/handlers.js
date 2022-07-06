const User = require('../../models/user');
const Organisation = require('../../models/organisation');
const Coupon = require('../../models/coupon');
const ProductPrice = require('../../models/product-price');
const Product = require('../../models/product');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateBusinessCustomerData,
  validateCreateBusinessCustomerData,
  getCouponQueryData,
  validateConnectedCustomerData,
  validateProductPrices,
  validateStatusData,
} = require('./helpers');
const {
  validateCouponData,
  generateCouponCode,
} = require('../coupon/helpers');
const { getReviews } = require('../helpers');
const { createCustomer } = require('../../../common/payment');
const { getCouncilByAddress } = require('../../helpers');
const EmailHelper = require('../../helpers/email');
const AddConnectedUserForm = require('./models/add-connected-user-form');

async function updateBusinessCustomer(req, res, next) {
  try {
    const customer = await User.findOne({ _id: req.params.id });
    if (!customer) {
      return next(notFoundExc('Customer not found'));
    }
    const data = req.body;
    const errors = await validateBusinessCustomerData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // update user data
    customer.avatar = data.avatar;
    customer.phone = data.phone;

    // update organisation information
    await customer.populate('businessCustomerProfile.organisation').execPopulate();
    const org = customer.businessCustomerProfile.organisation;
    org.abn = data.abn;
    org.name = data.businessName;
    org.address = data.address;
    org.paymentTypes = data.paymentTypes;

    await org.save();

    const council = await getCouncilByAddress(org.address);
    await User.updateMany(
      { 'businessCustomerProfile.organisation': org._id },
      { $set: { council: council ? council._id : undefined } },
    );

    await customer.updateStatus(data.status);
    return res.json(await customer.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function createBusCustomer(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateCreateBusinessCustomerData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }
    const customer = await createCustomer(data.businessEmail, data.businessName);
    const payment = {
      stripeCustomerId: customer.id,
      cardLast4Digits: '',
      cardBrand: '',
    };

    const org = new Organisation({
      abn: data.abn,
      name: data.businessName,
      email: data.businessEmail,
      address: data.address,
      payment,
    });
    await org.save();

    // save primary contact user
    const council = await getCouncilByAddress(org.address);
    const user = new User({
      email: data.email,
      status: User.STATUS_ACTIVE,
      roles: User.ROLE_BUS_CUSTOMER,
      avatar: data.avatar,
      council: council ? council._id : undefined,
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      businessCustomerProfile: {
        position: data.position,
        isPrimary: true,
        organisation: org._id,
      },
      contactMethod: User.CONTACT_METHOD_ADMIN,
    });

    await user.save();
    await EmailHelper.sendWelcomeEmailToBusinessCustomer(user);
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function getCoupons(req, res, next) {
  try {
    const query = await getCouponQueryData(req);
    const items = await Coupon.find(query.conditions).sort(query.sort);
    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

async function createCoupon(req, res, next) {
  try {
    const data = req.body;
    data.code = await generateCouponCode();
    const customer = await User.findById(req.params.id);
    data.organisation = customer.businessCustomerProfile.organisation;
    const errors = await validateCouponData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    if (data.type !== Coupon.TYPE_EXTRA) {
      delete data.extraProducts;
    }

    const coupon = new Coupon(data);
    // deactive all coupons of this organisation
    if (coupon.status === Coupon.STATUS_ACTIVE) {
      await Coupon.updateMany(
        { organisation: coupon.organisation },
        { $set: { status: Coupon.STATUS_INACTIVE } },
      );
    }
    // save the new coupon
    await coupon.save();

    return res.json(coupon.toObject());
  } catch (err) {
    return next(err);
  }
}

async function createConnectedUser(req, res, next) {
  try {
    const model = new AddConnectedUserForm();
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    const { customer } = model;
    return res.json(await customer.toUserObject());
  } catch (error) {
    return next(error);
  }
}

async function updateConnectedUser(req, res, next) {
  try {
    const customer = await User.findOne({ _id: req.params.id });
    if (!customer) {
      return next(notFoundExc('Customer not found'));
    }
    const data = req.body;
    const errors = await validateConnectedCustomerData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // update user data
    customer.firstname = data.firstname;
    customer.lastname = data.lastname;
    customer.email = data.email;
    customer.avatar = data.avatar;
    customer.phone = data.phone;

    // update organisation information
    await customer.populate('businessCustomerProfile.organisation').execPopulate();
    const org = customer.businessCustomerProfile.organisation;
    org.address = data.organisation.address;

    await org.save();

    const council = await getCouncilByAddress(org.address);
    await User.updateMany(
      { 'businessCustomerProfile.organisation': org._id },
      { $set: { council: council ? council._id : undefined } },
    );

    await customer.updateStatus(data.status);
    return res.json(await customer.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function getCustomerProductPrices(req, res, next) {
  try {
    const customer = await User.findById(req.params.id);
    const overridePrices = await ProductPrice.find({
      organisation: customer.businessCustomerProfile.organisation,
    });
    return res.json(overridePrices);
  } catch (err) {
    return next(err);
  }
}

async function updateCustomerProductPrices(req, res, next) {
  try {
    const customer = await User.findById(req.params.id);
    const { organisation } = customer.businessCustomerProfile;
    const data = req.body;
    const errors = await validateProductPrices(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    const products = await Product.find().sort({ name: 1 });
    const result = await Promise.all(data.map(async (item) => {
      const product = products.find(p => p._id.toString() === item.product);
      // create new item
      if (item.isNew) {
        const priceItem = new ProductPrice({
          product: product._id,
          organisation,
          prodPrice: item.prodPrice,
          colPrice: item.colPrice,
        });
        return priceItem.save();
      }

      // delete item
      if (item.isRemove) {
        return ProductPrice.findByIdAndRemove(item._id);
      }

      if (!product || (product.businessPrice === item.prodPrice
        && product.busColPrice === item.colPrice)) {
        return false;
      }

      // update item
      const priceItem = await ProductPrice.findById(item._id);
      priceItem.set({
        prodPrice: item.prodPrice,
        colPrice: item.colPrice,
      });
      return priceItem.save();
    }));

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateCouponStatus(req, res, next) {
  try {
    const errors = validateStatusData(req.body);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const coupon = await Coupon.findById(req.body.id);

    if (req.body.status === Coupon.STATUS_ACTIVE) {
      const customer = await User.findById(req.params.id);
      const activeCoupons = await Coupon.find({
        organisation: customer.businessCustomerProfile.organisation,
        status: Coupon.STATUS_ACTIVE,
        _id: {
          $ne: coupon._id,
        },
      });

      if (activeCoupons.length > 0) {
        // set all coupon to inactive
        await Coupon.updateMany({
          organisation: coupon.organisation,
        }, {
          $set: {
            status: Coupon.STATUS_INACTIVE,
          },
        });
      }
    }

    coupon.status = req.body.status;
    await coupon.save();
    return res.json(coupon);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  updateBusinessCustomer,
  createBusCustomer,
  getReviews,
  getCoupons,
  createCoupon,
  createConnectedUser,
  updateConnectedUser,
  getCustomerProductPrices,
  updateCustomerProductPrices,
  updateCouponStatus,
};
