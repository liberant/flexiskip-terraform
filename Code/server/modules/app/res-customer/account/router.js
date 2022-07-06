const handlers = require('./handlers');
const express = require('express');
const rateLimit  = require('express-rate-limit');
const {
  getProfile,
  changePassword,
} = require('../../user/handlers');

const router = express.Router();

// change profile's password
router.put(
  '/res-customer/account/profile/password',
  [handlers.checkUserAuthenticated, changePassword],
);

router.route('/res-customer/account/profile')
  // get account's data
  .get([handlers.checkUserAuthenticated, getProfile])
  // update account's data
  .put([handlers.checkUserAuthenticated, handlers.updateProfile]);

// sign in customer account using email
router.post('/res-customer/sign-in-with-link', handlers.signInWithLink);
router.get('/res-customer/verify-code', handlers.verifyCode);

// sign in customer
router.post('/res-customer/account/sessions', handlers.login);

// get Stripe client_secret for SetupIntent
const setupIntentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100 // limit each IP to 20 requests per windowMs
});
router.get('/res-customer/setup-intent-secret', setupIntentLimiter, [handlers.checkUserAuthenticated, handlers.getSetupIntentSecret]);
router.get('/res-customer/gc-cr-payment-intent-secret', setupIntentLimiter, [handlers.checkUserAuthenticated, handlers.getPaymentIntentSecretForCollectionRequest]);


router.get('/res-customer/get-payment-method', [handlers.checkUserAuthenticated, handlers.getCustomerPaymentMethod]);

module.exports = router;
