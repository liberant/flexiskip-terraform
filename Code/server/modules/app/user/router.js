const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.put('/users/fcmToken', [handlers.checkUserAuthenticated, handlers.submitFCMToken]);

router.delete('/users/session', [handlers.checkUserAuthenticated, handlers.logout]);

module.exports = router;
