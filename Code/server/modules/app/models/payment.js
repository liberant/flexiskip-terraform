const mongoose = require('mongoose');

const { Schema } = mongoose;

const PAYMENT_TYPE_STRIPE = 'stripe'; // apply for old version: credit card
const PAYMENT_TYPE_INVOICE = 'invoice';
const PAYMENT_TYPE_PAYPAL = 'paypal';

const paymentMethodSchema = new Schema(
  {
    type: {
      type: String,
      default: PAYMENT_TYPE_STRIPE,
      enum: [
        PAYMENT_TYPE_STRIPE, // initial default
        PAYMENT_TYPE_INVOICE,
        PAYMENT_TYPE_PAYPAL,
      ],
    },
    maximumInvoice: {
      type: Number,
    },
  },
  { _id: false },
);

module.exports = {
  paymentMethodSchema,
  PAYMENT_TYPE_STRIPE,
  PAYMENT_TYPE_INVOICE,
};

