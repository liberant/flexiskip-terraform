const handlers = require('./handlers');
const express = require('express');
const {
  requestResetPassword,
  resetPassword,
  getProfile,
} = require('../../user/handlers');

const router = express.Router();

// user login
router.post('/admin/account/sessions', handlers.login);

// forgot password: send reset password email
router.post('/admin/account/password-reset/requests', requestResetPassword);

// forgot password: reset account's password
router.put('/admin/account/password', resetPassword);

router.route('/admin/account/profile')
  // get account's data
  .get([handlers.checkUserAuthenticated, getProfile])
  // update account's data
  .put([handlers.checkUserAuthenticated, handlers.updateProfile]);

module.exports = router;
