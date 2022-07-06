const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/admin/ads')
  .get([checkUserAuthenticated, handlers.list])
  .post([checkUserAuthenticated, handlers.createItem]);

router.route('/admin/ads/status')
  .put([checkUserAuthenticated, handlers.deleteItems]);

router.route('/admin/ads/publish')
  .put([checkUserAuthenticated, handlers.publishAdvertising]);

router.route('/admin/ads/:id')
  .get([checkUserAuthenticated, handlers.getItemDetail])
  .put([checkUserAuthenticated, handlers.updateItem])
  .delete([checkUserAuthenticated, handlers.deleteItem]);

module.exports = router;
