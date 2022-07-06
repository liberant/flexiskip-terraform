const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.get('/admin/bin-requests/:id/notes', [checkUserAuthenticated, handlers.getNotes]);

router.post('/admin/bin-requests/:id/notes', [checkUserAuthenticated, handlers.addNote]);

router.put('/admin/bin-requests/notes/:id', [checkUserAuthenticated, handlers.updateNote]);

router.delete('/admin/bin-requests/notes/:id', [checkUserAuthenticated, handlers.deleteNote]);

module.exports = router;
