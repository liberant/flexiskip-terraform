const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.get('/admin/purchase/delivered-bins', [checkUserAuthenticated, handlers.getDeliveredBins]);

router.post('/admin/purchase/collection-requests', [checkUserAuthenticated, handlers.createCollectionRequest]);

module.exports = router;
