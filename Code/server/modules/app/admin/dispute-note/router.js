const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.get('/admin/disputes/:id/notes', [checkUserAuthenticated, handlers.getNotes]);

router.post('/admin/disputes/:id/notes', [checkUserAuthenticated, handlers.addNote]);

router.put('/admin/disputes/notes/:id', [checkUserAuthenticated, handlers.updateNote]);

router.delete('/admin/disputes/notes/:id', [checkUserAuthenticated, handlers.deleteNote]);

module.exports = router;
