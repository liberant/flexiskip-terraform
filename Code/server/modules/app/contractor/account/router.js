const express = require('express');
const handlers = require('./handlers');
const {
  requestResetPassword,
  resetPassword,
  getProfile,
} = require('../../user/handlers');

const router = express.Router();

// user login
router.post('/contractor/account/sessions', handlers.login);

// add new contractor registration
router.post('/contractor/account/registrations', handlers.register);

// forgot password: send reset password email
router.post('/contractor/account/password-reset/requests', requestResetPassword);

// forgot password: reset account's password
router.put('/contractor/account/password', resetPassword);

// update payment
router.put('/contractor/account/profile/payment', [handlers.checkUserAuthenticated, handlers.updatePayment]);

// update bank information
router.put('/contractor/account/profile/bank', [handlers.checkUserAuthenticated, handlers.updateBankInfo]);

router.route('/contractor/account/profile')
  // get account's data
  .get([handlers.checkUserAuthenticated, getProfile])
  // update account's data
  .put([handlers.checkUserAuthenticated, handlers.updateProfile]);

router.put('/contractor/account/status', [handlers.checkUserAuthenticated, handlers.updateStatus]);

// render onboarding form
router.get('/contractor/form', handlers.renderOnboardingForm);

module.exports = router;
