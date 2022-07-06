const { checkUserAuthenticated } = require('../account/handlers');
const express = require('express');
const handlers = require('./handlers');

const router = express.Router();

// get all product types
router.get('/customer/bin-requests/types', [checkUserAuthenticated, handlers.getProductTypes]);

// create cart
router.post('/customer/bin-requests/carts', [checkUserAuthenticated, handlers.createCart]);

router.route('/customer/bin-requests/carts/:cartId')
  // get cart detail
  .get([checkUserAuthenticated, handlers.getCartDetail])
  // update cart
  .put([checkUserAuthenticated, handlers.updateCart]);

router.route('/customer/bin-requests')
  // get customer's bin requests
  .get([checkUserAuthenticated, handlers.getBinRequests])
  // create new bin request
  .post([checkUserAuthenticated, handlers.createBinRequest]);

module.exports = router;
