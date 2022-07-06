const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/admin/coupons')
  .get([checkUserAuthenticated, handlers.getCoupons])
  .post([checkUserAuthenticated, handlers.createCoupon]);

router.put('/admin/coupons/status', [checkUserAuthenticated, handlers.massUpdateCouponStatus]);

router.route('/admin/coupons/:id')
  .get([checkUserAuthenticated, handlers.getCouponDetail])
  .put([checkUserAuthenticated, handlers.updateCoupon])
  .delete([checkUserAuthenticated, handlers.deleteCoupon]);

module.exports = router;
