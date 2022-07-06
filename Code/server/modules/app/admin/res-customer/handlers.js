const User = require('../../models/user');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  createSetupIntent,
  createPaymentIntent,
  getPaymentMethod,
} = require('../../../common/payment');
const { getReviews } = require('../helpers');
const AddCustomerForm = require('./models/add-customer-form');
const UpdateCustomerForm = require('./models/update-customer-form');

async function createResCustomer(req, res, next) {
  try {
    const model = new AddCustomerForm();
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    const { customer } = model;
    return res.json(await customer.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function updateResidentialCustomer(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return next(notFoundExc('User not found'));
    }
    const model = new UpdateCustomerForm(user);
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    const { customer } = model;
    return res.json(await customer.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function getSetupIntentSecret(req, res, next) {
  const customerId = req.params.id;
  try {
    const user = await User.findById(customerId);
    const setupIntent = await createSetupIntent(user.residentialCustomerProfile.payment.stripeCustomerId);
    return res.json({
      clientSecret: setupIntent.client_secret
    });
  } catch (err) {
    return next(err);
  }
}

async function getPaymentIntentSecretForCollectionRequest(req, res, next) {
  try {
    const customerId = req.params.id;
    const user = await User.findById(customerId);
    const paymentIntent = await createPaymentIntent(12500, user.residentialCustomerProfile.payment.stripeCustomerId);
    return res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  updateResidentialCustomer,
  createResCustomer,
  getReviews,
  getSetupIntentSecret,
  getPaymentIntentSecretForCollectionRequest,
};
