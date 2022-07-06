const middlewares = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/admin/vehicles/:id')
  .get([middlewares.checkUserAuthenticated, handlers.getVehicleDetail])
  .put([middlewares.checkUserAuthenticated, handlers.updateVehicle]);

module.exports = router;
