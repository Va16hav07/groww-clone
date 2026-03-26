const Order = require('../models/order.model');
const stockService = require('../services/stock.service');
const { producer } = require('../config/kafkaClient');
const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null
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

        // Fetch market price from Redis Cache to avoid hitting 1 req/s Indian Stock API limit
        let livePrice = await redis.hget('live_prices', symbol.toUpperCase());

        if (!livePrice) {
            console.warn(`[OMS] Cache miss for ${symbol}. Fetching live...`);
            livePrice = await stockService.getLatestPrice(symbol);
        } else {
            livePrice = parseFloat(livePrice);
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
                { value: JSON.stringify({ orderId: order.id, symbol, type, quantity, userId }) }
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
