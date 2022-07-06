const { checkUserAuthenticated } = require('../account/handlers');
const express = require('express');
const handlers = require('./handlers');
const rateLimit  = require('express-rate-limit');

const router = express.Router();

// get bin detail by bin code
router.get('/customer/collection-requests/bins/:code', [checkUserAuthenticated, handlers.getBinDetail]);

// create a new cart for making collection request
router.post('/customer/collection-requests/carts', [checkUserAuthenticated, handlers.createCart]);

const setupIntentLimiter = rateLimit({
    windowMs: 1 * 30 * 1000, // 30 s
    max: 1 // limit each IP to 1 requests per window
});
// create new collection request
router.post('/customer/collection-requests', setupIntentLimiter, [checkUserAuthenticated, handlers.createCollectionRequest]);

router.route('/customer/collection-requests/carts/:id')
  // get cart detail
  .get([checkUserAuthenticated, handlers.getCartDetail])
  // update cart
  .put([checkUserAuthenticated, handlers.updateCart]);

// list requests belong to customer
router.get('/customer/collection-requests', [checkUserAuthenticated, handlers.getCollectionRequests]);

// rate driver
router.put('/customer/collection-requests/:id/rating', [checkUserAuthenticated, handlers.rateDriver]);

// cancel collection request
router.put('/customer/collection-requests/:id/status', [checkUserAuthenticated, handlers.cancelCollectionRequest]);

// view driver detail
router.get('/customer/collection-requests/:id', [checkUserAuthenticated, handlers.getCollectionDriverDetail]);

// rate collection request
router.post("/collection-requests/:id/rating", handlers.ratingCollection);

// view collection detail
router.get("/collection-requests/:id", handlers.getCollectionDetail);


module.exports = router;
