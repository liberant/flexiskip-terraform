const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.get('/contractor/unassigned-jobs', [checkUserAuthenticated, handlers.getUnassignedJobs]);
router.post('/contractor/unassigned-jobs/:jobId/assign-driver', [checkUserAuthenticated, handlers.assignDriver]);

module.exports = router;
