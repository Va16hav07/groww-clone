const express = require('express');
const { streamPrices } = require('../controllers/price.controller');

const router = express.Router();

// SSE endpoint (usually not protected so guests can see prices, 
// but can be protected with JWT if desired). Leaving public for now.
router.get('/stream', streamPrices);

module.exports = router;
