const express = require('express');
const { checkUserAuthenticated } = require('../account/handlers');
const {
  getSummarySection,
  getRevenueSection,
} = require('./handlers');

const router = express.Router();

router.get('/contractor/dashboard/summary', [checkUserAuthenticated, getSummarySection]);

router.get('/contractor/dashboard/revenue', [checkUserAuthenticated, getRevenueSection]);

module.exports = router;
