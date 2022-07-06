const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// get available council products for an address

router.get('/purchase/addresses', handlers.getAddresses);
router.get('/purchase/products', handlers.getProductsByAddress);
router.get('/purchase/products-bcc', handlers.getProductsForBrisbaneCity);

// check if an address can purchase a council product
// create customer account for purchasing too
router.post('/purchase/customers', handlers.createCustomer);

// create order for purchase
router.post('/purchase/orders', [handlers.checkUserAuthenticated, handlers.createBinRequest]);
router.get('/purchase/delivered-bins', [handlers.checkUserAuthenticated, handlers.getDeliveredBins]);


// update bin's status for delivery
router.post('/purchase/collection-requests', [handlers.checkUserAuthenticated, handlers.createCollectionRequest]);


module.exports = router;
