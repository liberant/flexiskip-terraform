const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// refresh token
router.post('/tokens', handlers.verifyUserToken, handlers.refreshToken);
router.get('/check-token', handlers.verifyUserToken, (req, res, next) => {
  return res.json({ message: "Token is valid"});
});

// get product material options
router.get('/options/product/materials', handlers.getProductMaterialOptions);

// get waste type options
router.get('/options/waste-types', handlers.getWasteTypeOptions);

// Get state list
router.get('/options/states', handlers.getStates);

// Get region list
router.get('/options/regions', handlers.getRegions);

// Get settings api
router.get('/settings', handlers.getSettings);

// Get event list
router.post('/events', handlers.addEvent);

// view bin list & qr code (for testing only)
router.get('/bins', handlers.viewBins);

module.exports = router;
