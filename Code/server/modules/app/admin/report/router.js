const middlewares = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// customer collection report csv download
router.get('/admin/reports/customer-col', [middlewares.checkUserAuthenticated, handlers.customerReport]);
// customer collection report csv download
router.get('/admin/reports/customer', [middlewares.checkUserAuthenticated, handlers.customerBinReport]);
// activity report
router.get('/admin/reports/activity', [middlewares.checkUserAuthenticated, handlers.activityReport]);

// activity bin report
router.get('/admin/reports/activityBin', [middlewares.checkUserAuthenticated, handlers.activityBinReport]);

// discount code report
router.get('/admin/reports/council-discount-code', [middlewares.checkUserAuthenticated, handlers.councilDiscountReport]);

// export reports to Google sheet
router.get('/admin/reports/export-to-google-sheet', [middlewares.checkUserAuthenticated, handlers.exportToGoogleSheet]);

router.get('/admin/reports/export-csv', [middlewares.checkUserAuthenticated, handlers.exportCSVReport]);

module.exports = router;
