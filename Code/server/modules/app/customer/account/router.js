const express = require('express');
const handlers = require('./handlers');
const {
  requestResetPassword,
  resetPassword,
} = require('../../user/handlers');

const router = express.Router();

// customer login
router.post('/customer/account/sessions', handlers.login);

// customer registration
router.post('/customer/account/registrations', handlers.register);

// send reset password link to email
router.post('/customer/account/password-reset/requests', requestResetPassword);

// update account's password
router.put('/customer/account/password', resetPassword);

// update account's profile payment information
router.put('/customer/account/profile/payment', [handlers.checkUserAuthenticated, handlers.updatePayment]);

// get customer used addresses
router.get('/customer/account/addresses', [handlers.checkUserAuthenticated, handlers.getAddresses]);

// check customer address
router.post('/customer/address-checking', [handlers.checkAddress]);

module.exports = router;
