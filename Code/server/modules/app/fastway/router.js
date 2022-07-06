const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// handle fastway notification
router.post('/fastway/notifications', handlers.processNotification);

module.exports = router;
