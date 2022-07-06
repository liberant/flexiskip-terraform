const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.put('/admin/admins/:id', [checkUserAuthenticated, handlers.updateAdmin]);

router.post('/admin/admins', [checkUserAuthenticated, handlers.createAdmin]);

module.exports = router;
