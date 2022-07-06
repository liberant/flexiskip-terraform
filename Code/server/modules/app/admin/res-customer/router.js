const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.put('/admin/res-customers/:id/ratings', [checkUserAuthenticated, handlers.getReviews]);

router.put('/admin/res-customers/:id', [checkUserAuthenticated, handlers.updateResidentialCustomer]);

router.get('/admin/res-customers/:id/setup-intent-secret', [checkUserAuthenticated, handlers.getSetupIntentSecret]);
router.get('/admin/res-customers/:id/gc-cr-payment-intent-secret', [checkUserAuthenticated, handlers.getPaymentIntentSecretForCollectionRequest]);

router.route('/admin/res-customers')
  .post([checkUserAuthenticated, handlers.createResCustomer]);
module.exports = router;
