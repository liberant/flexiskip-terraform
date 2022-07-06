const middlewares = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.get('/contractor/transactions', [middlewares.checkUserAuthenticated, handlers.getTransactions]);

router.get('/contractor/transactions/:id', [middlewares.checkUserAuthenticated, handlers.getTransactionDetail]);

module.exports = router;
