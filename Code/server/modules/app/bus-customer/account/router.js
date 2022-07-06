const express = require('express');
const handlers = require('./handlers');
const {
  getProfile,
  changePassword,
} = require('../../user/handlers');

const router = express.Router();

// change profile's password
router.put(
  '/bus-customer/account/profile/password',
  [handlers.checkUserAuthenticated, changePassword],
);

router.route('/bus-customer/account/profile')
  // get account's data
  .get([handlers.checkUserAuthenticated, getProfile])
  // update account's data
  .put([handlers.checkUserAuthenticated, handlers.updateProfile]);

// validate connected user data
router.post('/bus-customer/account', handlers.validateConnectedUser);

module.exports = router;
