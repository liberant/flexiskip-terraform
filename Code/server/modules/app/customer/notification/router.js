const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.get('/customer/notifications', [checkUserAuthenticated, handlers.list]);

module.exports = router;
