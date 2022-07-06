
const express = require('express');
const multer = require('multer');
const handlers = require('./handlers');
const { checkUserAuthenticated } = require('../account/handlers');

const router = express.Router();
const upload = multer({ dest: 'tmp/csv/' });

// bin request - export CSV on portal
router.get('/admin/bin-requests/report', [checkUserAuthenticated, handlers.exportBinRequestList]);

// get bin request detail
router.route('/admin/bin-requests/:id')
  .get([checkUserAuthenticated, handlers.getBinRequestDetail])
  .put([checkUserAuthenticated, handlers.updateBinRequest]);

// get list of bin requests
router.get('/admin/bin-requests', [checkUserAuthenticated, handlers.getBinRequestList]);

// update status of multiple bin requests
router.put('/admin/bin-requests/status', [checkUserAuthenticated, handlers.updateBinRequestStatus]);

// generate qrcode for multiple bins
// send pickup request to Fastway Courier
router.post('/admin/bins/qrcode', [checkUserAuthenticated, handlers.prinQRCode]);

// update delivery status of a bin
router.put('/admin/bins/:id/status', [checkUserAuthenticated, handlers.updateBinDeliveryStatus]);

// update collection requeststatus of a bin
router.put('/admin/bins/:id/collection-status', [
  checkUserAuthenticated,
  handlers.updateBinCollectionStatus,
]);

// update delivery status of all bins in bin-request
router.put('/admin/bin-requests/:id/delivery-status', [checkUserAuthenticated, handlers.updateBinRequestDeliveryStatus]);

router.post('/admin/bin-requests/import', checkUserAuthenticated, upload.single('file'), handlers.importProductOrders);

router.get('/admin/bin-requests/:id/download-qr-code', [checkUserAuthenticated, handlers.downloadQRCode]);
// Create a bin request
router.post('/admin/bin-requests', [checkUserAuthenticated, handlers.createBinRequest]);


module.exports = router;
