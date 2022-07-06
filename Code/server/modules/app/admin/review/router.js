const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.get('/admin/reviews', [checkUserAuthenticated, handlers.getReports]);

router.route('/admin/reviews/:id')
  .put([checkUserAuthenticated, handlers.updateReport])
  .get([checkUserAuthenticated, handlers.getReportDetail]);

module.exports = router;
