const middlewares = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/contractor/vehicles')
  .get([middlewares.checkUserAuthenticated, handlers.getVehicles])
  .post([middlewares.checkUserAuthenticated, handlers.createVehicle]);

router.put('/contractor/vehicles/status', [middlewares.checkUserAuthenticated, handlers.updateStatuses]);

router.route('/contractor/vehicles/:id')
  .get([middlewares.checkUserAuthenticated, handlers.getVehicleDetail])
  .put([middlewares.checkUserAuthenticated, handlers.updateVehicle])
  .delete([middlewares.checkUserAuthenticated, handlers.deleteVehicle]);

router.put('/contractor/vehicles/:id/status', handlers.updateStatus);

module.exports = router;
