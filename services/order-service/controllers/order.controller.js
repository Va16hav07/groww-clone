const Order = require('../models/order.model');
const User = require('../models/user.model');
const stockService = require('../services/stock.service');
const { producer } = require('../config/kafkaClient');
const Redis = require('ioredis');

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

exports.placeOrder = async (req, res) => {
    try {
        const { symbol, type, quantity } = req.body;
        const userId = req.userId;

        if (!symbol || !type || !quantity) {
            return res.status(400).json({ error: 'Symbol, type, and quantity are required' });
        }

        if (!['BUY', 'SELL'].includes(type.toUpperCase())) {
            return res.status(400).json({ error: 'Type must be BUY or SELL' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        if (type.toUpperCase() === 'SELL') {
            const availableQuantity = await Order.getAvailableQuantity(userId, symbol.toUpperCase());
            if (availableQuantity < quantity) {
                return res.status(400).json({
                    error: `Insufficient holdings. You only have ${availableQuantity} available shares of ${symbol.toUpperCase()}.`
                });
            }
        }

        // Fetch market price from Redis Cache to avoid hitting 1 req/s Indian Stock API limit
        let livePrice = await redis.hget('live_prices', symbol.toUpperCase());

        if (!livePrice) {
            console.warn(`[OMS] Cache miss for ${symbol}. Fetching live...`);
            livePrice = await stockService.getLatestPrice(symbol);
        } else {
            livePrice = parseFloat(livePrice);
        }

        if (type.toUpperCase() === 'BUY') {
            const user = await User.findById(userId);
            const totalCost = quantity * livePrice;
            if (parseFloat(user.balance) < totalCost) {
                return res.status(400).json({
                    error: `Insufficient balance. You need ₹${totalCost.toFixed(2)} to buy these shares. Current balance: ₹${user.balance}.`
                });
            }
        }

        // Create the order in the database
        const order = await Order.create(
            userId,
            symbol.toUpperCase(),
            type.toUpperCase(),
            quantity,
            livePrice,
            'PENDING' // Orders start as PENDING
        );

        // Add the order to the Kafka processing queue (orders topic)
        await producer.send({
            topic: 'orders',
            messages: [
                { value: JSON.stringify({ orderId: order.id, symbol, type: type.toUpperCase(), quantity, userId, price: livePrice }) }
            ]
        });

        res.status(201).json({
            message: 'Order placed successfully and queued for execution via Kafka',
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
