const middlewares = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// transaction report csv download
router.get('/contractor/reports/transaction', [middlewares.checkUserAuthenticated, handlers.transactionReport]);

module.exports = router;
