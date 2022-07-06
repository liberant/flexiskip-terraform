const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// approve/reject contractor registration
router.put('/admin/contractors/:id/status', [checkUserAuthenticated, handlers.updateContractorStatus]);

// update contractor
router.put('/admin/contractors/:id', [checkUserAuthenticated, handlers.updateContractor]);

// list contractors
router.post('/admin/contractors', [checkUserAuthenticated, handlers.addContractor]);

module.exports = router;
