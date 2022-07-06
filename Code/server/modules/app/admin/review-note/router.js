const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.get('/admin/reviews/:id/notes', [checkUserAuthenticated, handlers.getNotes]);

router.post('/admin/reviews/:id/notes', [checkUserAuthenticated, handlers.addNote]);

router.put('/admin/reviews/notes/:id', [checkUserAuthenticated, handlers.updateNote]);

router.delete('/admin/reviews/notes/:id', [checkUserAuthenticated, handlers.deleteNote]);

module.exports = router;
