const express = require('express');
const multer = require('multer');
const middlewares = require('../account/handlers');
const handlers = require('./handlers');

const router = express.Router();
const upload = multer({ dest: 'tmp/csv/' });

router.post('/admin/import/product-orders', middlewares.checkUserAuthenticated, upload.single('file'), handlers.importProductOrders);

module.exports = router;
