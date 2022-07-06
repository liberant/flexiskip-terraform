const handlers = require('./handlers');
const express = require('express');
const {
  requestResetPassword,
  resetPassword,
  getProfile,
  changePassword,
} = require('../../user/handlers');

const router = express.Router();

// driver login
router.post('/driver/account/sessions', handlers.login);

// send reset password link to email
router.post('/driver/account/password-reset/requests', requestResetPassword);

// update account's password
router.put('/driver/account/password', resetPassword);

router.route('/driver/account/profile')
  // get account's data
  .get([handlers.checkUserAuthenticated, getProfile])
  // update account's data
  .put([handlers.checkUserAuthenticated, handlers.updateProfile]);

router.put('/driver/account/status', [handlers.checkUserAuthenticated, handlers.updateStatus]);

router.put('/driver/account/profile/password', [handlers.checkUserAuthenticated, changePassword]);

// render onboarding form
router.get('/driver/form', handlers.renderOnboardingForm);

module.exports = router;
