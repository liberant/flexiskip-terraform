const { checkUserAuthenticated } = require('../account/handlers');
const handlers = require('./handlers');
const express = require('express');


const router = express.Router();

// collection request - export CSV on portal
router.get('/admin/collection-requests/report', [checkUserAuthenticated, handlers.exportItems]);

router.route('/admin/collection-requests/:id')
  // get collection request detail
  .get([checkUserAuthenticated, handlers.getItem])
  // update collection request
  .put([checkUserAuthenticated, handlers.updateItem]);

// list collection requests
router.get('/admin/collection-requests', [checkUserAuthenticated, handlers.getItems]);

module.exports = router;
