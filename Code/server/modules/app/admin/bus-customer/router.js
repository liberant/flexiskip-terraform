const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// get customer's reviews
router.get('/admin/bus-customers/:id/ratings', [checkUserAuthenticated, handlers.getReviews]);

// get customer's coupons
router.get('/admin/bus-customers/:id/coupons', [checkUserAuthenticated, handlers.getCoupons]);

// create new coupon for customer
router.post('/admin/bus-customers/:id/coupons', [checkUserAuthenticated, handlers.createCoupon]);

// update customer's data
router.put('/admin/bus-customers/:id', [checkUserAuthenticated, handlers.updateBusinessCustomer]);

// create customer
router.route('/admin/bus-customers')
  .post([checkUserAuthenticated, handlers.createBusCustomer]);

// add connected user to customer
router.post('/admin/bus-customers/connected-user', [checkUserAuthenticated, handlers.createConnectedUser]);

// update connected user
router.put('/admin/bus-customers/connected-user/:id', [checkUserAuthenticated, handlers.updateConnectedUser]);

router.route('/admin/bus-customers/:id/prices')
  // get customer's product price list
  .get([checkUserAuthenticated, handlers.getCustomerProductPrices])
  // update customer's product price list
  .put([checkUserAuthenticated, handlers.updateCustomerProductPrices]);

router.put('/admin/bus-customers/:id/coupons/status', [checkUserAuthenticated, handlers.updateCouponStatus]);

module.exports = router;
