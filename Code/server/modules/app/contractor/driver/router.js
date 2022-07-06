const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// update status of multiple drivers
router.put('/contractor/drivers/status', [checkUserAuthenticated, handlers.massUpdateDriverStatus]);

// get driver's rating data
router.get('/contractor/drivers/:id/ratings', [checkUserAuthenticated, handlers.getReviews]);

// invite driver
router.post('/contractor/drivers/invitations', [checkUserAuthenticated, handlers.inviteDriver]);

router.route('/contractor/drivers/:id')
  // get driver information
  .get([checkUserAuthenticated, handlers.getDriverDetail])
  // update driver information
  .put([checkUserAuthenticated, handlers.updateDriverDetail]);

router.route('/contractor/drivers')
  // get list of drivers
  .get([checkUserAuthenticated, handlers.getDrivers])
  // add driver
  .post([checkUserAuthenticated, handlers.createDriver]);

module.exports = router;
