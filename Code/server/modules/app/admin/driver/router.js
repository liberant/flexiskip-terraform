const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.put('/admin/drivers/:id/ratings', [checkUserAuthenticated, handlers.getReviews]);

router.put('/admin/drivers/:id', [checkUserAuthenticated, handlers.updateDriver]);

router.post('/admin/drivers', [checkUserAuthenticated, handlers.createDriver]);

// export non-activity drivers as csv
router.get('/admin/drivers/non-activity/csv', [checkUserAuthenticated, handlers.exportNonActivityDrivers]);

// get non-activity driver list
router.get('/admin/drivers/non-activity', [checkUserAuthenticated, handlers.getNonActivityDrivers]);

module.exports = router;
