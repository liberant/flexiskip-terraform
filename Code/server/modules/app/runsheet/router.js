const express = require('express');
const handlers = require('./handlers');

const router = express.Router();

router.post('/runsheet', handlers.getSummaryCollection);
router.get('/runsheet/report', handlers.pendingStatusReport);
router.put('/runsheet/close-job/:id', handlers.closeJob);
router.put('/runsheet/collection-requests/:id', handlers.updateColletion);

module.exports = router;
