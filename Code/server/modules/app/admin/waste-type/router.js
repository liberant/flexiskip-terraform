const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/admin/waste-types')
  .get([checkUserAuthenticated, handlers.listItems]);

router.route('/admin/waste-types/:id/image')
  .put([checkUserAuthenticated, handlers.updateItemImage]);

module.exports = router;
