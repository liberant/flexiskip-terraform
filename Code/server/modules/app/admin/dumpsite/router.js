const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/admin/dumpsites')
  .get([checkUserAuthenticated, handlers.listItems])
  .post([checkUserAuthenticated, handlers.createItem]);

router.route('/admin/dumpsites/status')
  .put([checkUserAuthenticated, handlers.updateItemsStatus]);

router.route('/admin/dumpsites/:id')
  .get([checkUserAuthenticated, handlers.getItem])
  .put([checkUserAuthenticated, handlers.updateItem])
  .delete([checkUserAuthenticated, handlers.deleteItem]);

module.exports = router;
