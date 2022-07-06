const handlers = require('./handlers');
const express = require('express');
const { checkUserAuthenticated, checkUserAuthenticatedIncludesAdmin } = require('../account/handlers');

const router = express.Router();

// get collection request list (available, confirmed, completed)
router.get('/driver/collection-requests/available', [checkUserAuthenticated, handlers.getAvailableColReqs]);
router.get('/driver/collection-requests/confirmed', [checkUserAuthenticated, handlers.getConfirmedColReqs]);
router.get('/driver/collection-requests/completed', [checkUserAuthenticated, handlers.getCompletedColReqs]);

// @deprecated
router.get('/driver/collection-requests', [checkUserAuthenticated, handlers.getCollectionRequests]);

// get collection request detail
router.get('/driver/collection-requests/:id', [checkUserAuthenticated, handlers.getCollectionRequestDetail]);

// update status of bin
router.put('/driver/bins/:id/status', [checkUserAuthenticated, handlers.updateBinStatus]);

// update disposal address
router.put('/driver/collection-requests/:id/disposal-address', [checkUserAuthenticated, handlers.updateDisposalAddress]);

// update status of collection request
router.put('/driver/collection-requests/:id/status', [checkUserAuthenticatedIncludesAdmin, handlers.updateCollectionRequestStatus]);

// accept a collection request
router.put('/driver/collection-requests/:id/accept', [checkUserAuthenticated, handlers.acceptCollectionRequest]);

// Rate Customer
router.put('/driver/collection-requests/:id/rating', [checkUserAuthenticated, handlers.rateCustomer]);

// Create dispute
router.post('/driver/collection-requests/:id/disputes', [checkUserAuthenticated, handlers.createDispute]);

module.exports = router;
