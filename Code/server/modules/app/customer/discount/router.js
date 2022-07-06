const express = require('express');
const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');

const router = express.Router();

// check customer address
router.get('/customer/discount', [checkUserAuthenticated, handlers.getDiscount]);

module.exports = router;
