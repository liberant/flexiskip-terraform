const express = require('express');
const handlers = require('./handlers');
const { checkUserAuthenticated } = require('../account/handlers');

const router = express.Router();

router.get('/admin/transactions', [checkUserAuthenticated, handlers.getTransactions]);

// export transaction
router.get('/admin/transactions-csv', [checkUserAuthenticated, handlers.exportTransactions]);


module.exports = router;
