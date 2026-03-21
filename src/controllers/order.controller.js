const Order = require('../models/order.model');
const stockService = require('../services/stock.service');

exports.placeOrder = async (req, res) => {
    try {
        const { symbol, type, quantity } = req.body;
        const userId = req.userId; // From auth.middleware

        if (!symbol || !type || !quantity) {
            return res.status(400).json({ error: 'Symbol, type, and quantity are required' });
        }

        if (!['BUY', 'SELL'].includes(type.toUpperCase())) {
            return res.status(400).json({ error: 'Type must be BUY or SELL' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        // Fetch live market price from Indian Stock API
        const livePrice = await stockService.getLatestPrice(symbol);

        // Create the order in the database
        const order = await Order.create(
            userId,
            symbol.toUpperCase(),
            type.toUpperCase(),
            quantity,
            livePrice,
            'PENDING' // Orders start as PENDING
        );

        res.status(201).json({
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Order placement error:', error.message);
        res.status(500).json({ error: error.message || 'Server error placing order' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.findByUserId(userId);
        res.json({ orders });
    } catch (error) {
        console.error('Fetching orders error:', error.message);
        res.status(500).json({ error: 'Server error fetching orders' });
    }
};
