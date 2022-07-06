const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.get('/customer/transactions/currents', [checkUserAuthenticated, handlers.getCurrentTransactions]);

router.get('/customer/transactions/pasts', [checkUserAuthenticated, handlers.getPastTransactions]);
module.exports = router;
