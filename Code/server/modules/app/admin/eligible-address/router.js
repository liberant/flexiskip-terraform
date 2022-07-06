const middlewares = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/admin/eligible-addresses')
  .get([middlewares.checkUserAuthenticated, handlers.getAddresses])
  .post([middlewares.checkUserAuthenticated, handlers.createAddress])
  .delete([middlewares.checkUserAuthenticated, handlers.deleteBatchAddress])

router.route('/admin/import-eligible-addresses/upload-params')
  .get([middlewares.checkUserAuthenticated, handlers.getUploadParams])

router.route('/admin/import-eligible-addresses')
  .get([middlewares.checkUserAuthenticated, handlers.importAddresses])

module.exports = router;
