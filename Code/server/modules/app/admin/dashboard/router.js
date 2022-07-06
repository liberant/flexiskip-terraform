const express = require('express');
const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');

const router = express.Router();

router.get('/admin/dashboard/summary', [checkUserAuthenticated, handlers.getSummarySection]);

router.get('/admin/dashboard/revenue', [checkUserAuthenticated, handlers.getRevenueSection]);

router.get('/admin/dashboard/rate', [checkUserAuthenticated, handlers.getRateSection]);

router.get('/admin/dashboard/risk', [checkUserAuthenticated, handlers.getAtRiskSection]);

router.get('/admin/dashboard/inactive', [checkUserAuthenticated, handlers.getInactiveSection]);

// assign drivers to a request
router.put('/admin/dashboard/jobs/:id/driver', [checkUserAuthenticated, handlers.assignDriver]);

// find drivers for carrying a request
router.get('/admin/dashboard/jobs/:id/drivers', [checkUserAuthenticated, handlers.findDrivers]);

// get pending collection requests
router.get('/admin/dashboard/jobs', [checkUserAuthenticated, handlers.getPendingColReqs]);

// get data displayed on map
router.get('/admin/dashboard/map', [checkUserAuthenticated, handlers.getMapSection]);

module.exports = router;
