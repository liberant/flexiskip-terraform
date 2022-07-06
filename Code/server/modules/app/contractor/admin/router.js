const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// update status of multiple drivers
router.put('/contractor/admins/status', [checkUserAuthenticated, handlers.massUpdateUserStatus]);

// get contractor admin user list
router.route('/contractor/admins')
  .get([checkUserAuthenticated, handlers.list])
  .post([checkUserAuthenticated, handlers.add]);

router.route('/contractor/admins/:id')
  // get admin information
  .get([checkUserAuthenticated, handlers.detail])
  // update admin information
  .put([checkUserAuthenticated, handlers.update]);

module.exports = router;
