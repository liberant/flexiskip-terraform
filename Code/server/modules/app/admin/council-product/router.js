const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/admin/council-products')
  .get([checkUserAuthenticated, handlers.listItems])
  .post([checkUserAuthenticated, handlers.createItem]);

router.route('/admin/council-products/:id/status')
  .put([checkUserAuthenticated, handlers.updateItemStatus]);

router.route('/admin/council-products/:id')
  .get([checkUserAuthenticated, handlers.getItem])
  .put([checkUserAuthenticated, handlers.updateItem])
  .delete([checkUserAuthenticated, handlers.deleteItem]);

module.exports = router;
