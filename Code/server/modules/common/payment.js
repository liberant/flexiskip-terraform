/* eslint linebreak-style: 0 */
const logger = require('./log');
const config = require('../../config');
const stripe = require('stripe')(config.stripeSecretKey);

async function createCustomer(email, description = '') {
  try {
    const customer = await stripe.customers.create({
      email,
      description,
    });
    return customer;
  } catch (error) {
    throw error;
  }
}

async function updateCustomerCard(customerId, stripeToken) {
  try {
    const customer = await stripe.customers.update(customerId, {
      source: stripeToken,
    });
    return customer;
  } catch (error) {
    throw error;
  }
}


/**
 * Get customer payment method
 *
 * @param {String} trigger: 'gcc-violation-charge' (get all if null)
 */
async function getPaymentMethod(customerId, trigger) {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return !trigger ? paymentMethods.data : paymentMethods.data.filter(pm => pm.metadata.trigger == trigger);
  } catch (err) {
    throw err;
  }
}

async function removeAllCardsOfCustomer(customerId) {
  try {
    const cards = await stripe.customers.listCards(customerId);
    const promies = cards.data.map(card => stripe.customers.deleteCard(customerId, card.id));
    await Promise.all(promies);
  } catch (error) {
    throw error;
  }
}

async function createSetupIntent(customerId) {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId
    });
    return setupIntent;
  } catch (error) {
    throw error;
  }
}


/**
 * Charge the Customer (using customer id) instead of the card (using stripe token)
 *
 * @param {String} customerId
 */
async function chargeCustomer(customerId, amount, description = '', data) {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency: 'AUD',
      customer: customerId,
      description,
      metadata: data,

      // An arbitrary string to be displayed on your customer's credit card statement.
      // This can be up to 22 characters.
      // statement_descriptor: 'Statement description',
    });
    return charge.id;
  } catch (error) {
    throw error;
  }
}

async function getAllCharges() {
  try {
    const list = await stripe.charges.list();
    return list;
  } catch (err) {
    throw err;
  }
}

/**
 * Two steps payment
 * Authorize a charge
 * Return a charge id to settle later
 *
 * @param {String} customerId
 * @param {Number} amount
 * @param {String} description
 */
async function authorizeCharge(customerId, amount, description = '', data) {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency: 'AUD',
      description,
      customer: customerId,
      metadata: data,
      capture: false,
      // source: token,
    });
    logger.info(`Authorized a two step payment for
      customer ${customerId}, amount: ${amount} (${description}),
      charge id: ${charge.id}`);
    return charge.id;
  } catch (err) {
    throw err;
  }
}

/**
 * Two steps payment
 * Capture a charge
 *
 * @param {String} chargeId
 * @param {Number} amount
 * @param {String} description
 */
async function settleCharge(chargeId) {
  try {
    const charge = await stripe.charges.capture(chargeId);
    logger.info(`Settled a two step payment for the charge ${chargeId}`);
    return charge.id;
  } catch (err) {
    throw err;
  }
}

async function createPaymentIntent(amount, customerId = null) {
  try {
    const body = {
      amount: amount,
      currency: 'aud',
      capture_method: 'manual',
    }
    if (customerId) body.customer = customerId;
    const paymentIntent = await stripe.paymentIntents.create(body);
    return paymentIntent;
  } catch (err) {
    throw err;
  }
}

async function createAndChargeFutileBinPaymentIntent(customerId, paymentMethodId, type) {
  try {
    let body;
    if (type == 'gcc'){
      body = {
       amount: 4950,
       currency: 'aud',
       customer: customerId,
       payment_method: paymentMethodId,
       off_session: true,
       confirm: true,
       application_fee_amount: 117,
       on_behalf_of: config.gcStripeConnectedAccount,
       transfer_data: {
         destination: config.gcStripeConnectedAccount,
       }
     }
    } else {
      body = {
       amount: 4950,
       currency: 'aud',
       customer: customerId,
       payment_method: paymentMethodId,
       off_session: true,
       confirm: true,
     }
    }

    const paymentIntent = await stripe.paymentIntents.create(body);
    return paymentIntent;
  } catch (err) {
    throw err;
  }
}

async function createAndChargeGCCViolationPaymentIntent(customerId, paymentMethodId) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 4554,
      currency: 'aud',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      application_fee_amount: 110, // calculated using domestic fee: ($45.54 * 1.75%) + $0.30
      on_behalf_of: config.gcStripeConnectedAccount,
      transfer_data: {
        destination: config.gcStripeConnectedAccount,
      }
    });

    return paymentIntent;
  } catch (err) {
    throw err;
  }
}

async function getPaymentIntent(paymentIntentId) {
  try {
    return stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (err) {
    throw err;
  }
}

async function capturePaymentIntent(paymentIntentId) {
  try {
    return stripe.paymentIntents.capture(paymentIntentId);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createCustomer,
  updateCustomerCard,
  removeAllCardsOfCustomer,
  chargeCustomer,
  getAllCharges,
  authorizeCharge,
  settleCharge,
  createSetupIntent,
  getPaymentMethod,
  createPaymentIntent,
  getPaymentIntent,
  createAndChargeGCCViolationPaymentIntent,
  createAndChargeFutileBinPaymentIntent,
  capturePaymentIntent,
};
