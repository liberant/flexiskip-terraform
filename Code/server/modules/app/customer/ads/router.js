const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.post('/customer/ads/:id/like', [checkUserAuthenticated, handlers.likeAds]);

router.delete('/customer/ads/:id/like', [checkUserAuthenticated, handlers.unlikeAds]);

router.get('/customer/ads/:slug', handlers.renderAds);

router.get('/customer/ads', [checkUserAuthenticated, handlers.list]);

module.exports = router;
