const mongoose = require('mongoose');
const {
  paymentMethodSchema,
  PAYMENT_TYPE_STRIPE,
} = require('./payment');

const { Schema } = mongoose;

const organisationSchema = new Schema({
  abn: { type: String },
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  contact: {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  paymentTypes: [{
    type: paymentMethodSchema,
    default: [{
      type: PAYMENT_TYPE_STRIPE,
    }],
  }],
  payment: {
    stripeCustomerId: { type: String },
    cardLast4Digits: { type: String },
    cardBrand: { type: String },
  },
  bank: {
    name: { type: String },
    bsb: { type: String },
    accountNo: { type: String },
  },
  inRotation: {
    type: Boolean,
  },
  runsheet: {
    url: { type: String },
    password: { type: String },
  },
});

const Organisation = mongoose.model('Organisation', organisationSchema);

module.exports = Organisation;

