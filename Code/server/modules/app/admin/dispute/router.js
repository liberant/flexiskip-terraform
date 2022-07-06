const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.get('/admin/disputes', [checkUserAuthenticated, handlers.getDisputes]);

router.route('/admin/disputes/:id')
  .put([checkUserAuthenticated, handlers.updateDispute])
  .get([checkUserAuthenticated, handlers.getDisputeDetail]);

router.get('/admin/disputes/:id/charge-futile', [checkUserAuthenticated, handlers.chargeFutile]);

module.exports = router;
