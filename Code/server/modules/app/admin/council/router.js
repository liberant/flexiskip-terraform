const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/admin/councils')
  .get([checkUserAuthenticated, handlers.listItems])
  .post([checkUserAuthenticated, handlers.createItem]);

router.route('/admin/councils/status')
  .put([checkUserAuthenticated, handlers.updateItemsStatus]);

router.route('/admin/councils/:id/products')
  .get([checkUserAuthenticated, handlers.getCouncilProducts]);

router.route('/admin/councils/:id')
  .get([checkUserAuthenticated, handlers.getItem])
  .put([checkUserAuthenticated, handlers.updateItem])
  .delete([checkUserAuthenticated, handlers.deleteItem]);

module.exports = router;
