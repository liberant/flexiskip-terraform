const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.put('/admin/council-officers/:id', [checkUserAuthenticated, handlers.updateCouncilOfficer]);

router.route('/admin/council-officers')
  .post([checkUserAuthenticated, handlers.createCouncilOfficer]);
  
module.exports = router;
