const middlewares = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/admin/products')
  .get([middlewares.checkUserAuthenticated, handlers.getProducts])
  .post([middlewares.checkUserAuthenticated, handlers.createProduct])
  .put([middlewares.checkUserAuthenticated, handlers.deleteMultiProducts]);

router.route('/admin/products/:productId')
  .get([middlewares.checkUserAuthenticated, handlers.getProductDetail])
  .put([middlewares.checkUserAuthenticated, handlers.updateProduct])
  .delete([middlewares.checkUserAuthenticated, handlers.deleteProduct]);

module.exports = router;
