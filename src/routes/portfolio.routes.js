const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, portfolioController.getPortfolio);
router.post('/add-money', protect, portfolioController.addMoney);

module.exports = router;
