const handlers = require('./handlers');
const express = require('express');
const { checkUserAuthenticated } = require('../account/handlers');

const router = express.Router();

// get list of available vehicles for current driver
router.get('/driver/vehicles', [checkUserAuthenticated, handlers.getVehicles]);

module.exports = router;
