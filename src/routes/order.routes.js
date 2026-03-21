const express = require('express');
const { placeOrder, getUserOrders } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, getUserOrders);

module.exports = router;
