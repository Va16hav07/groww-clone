const express = require('express');
const { streamPrices } = require('../controllers/price.controller');

const router = express.Router();

router.get('/stream', streamPrices);

module.exports = router;
