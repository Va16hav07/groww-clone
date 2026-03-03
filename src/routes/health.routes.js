const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

router.get('/ping', healthController.ping);
router.get('/health', healthController.healthCheck);

module.exports = router;
