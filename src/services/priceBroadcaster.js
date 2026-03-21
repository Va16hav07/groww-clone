const Redis = require('ioredis');
const stockService = require('./stock.service');
const { broadcastToClients } = require('../controllers/price.controller');

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null
});

// The list of symbols we want to actively stream to clients
const TRACKED_SYMBOLS = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];

let intervalId = null;

const startBroadcasting = () => {
    if (intervalId) return; // already running

    console.log('[Price Broadcaster] Starting live market data feed...');

    // Poll every 5 seconds
    intervalId = setInterval(async () => {
        try {
            const newPrices = {};

            // Concurrently fetch prices for all tracked symbols to speed up the loop
            const promises = TRACKED_SYMBOLS.map(async (symbol) => {
                try {
                    const price = await stockService.getLatestPrice(symbol);
                    newPrices[symbol] = price;
                } catch (err) {
                    console.error(`[Price Broadcaster] Failed to fetch ${symbol}:`, err.message);
                }
            });

            await Promise.all(promises);

            if (Object.keys(newPrices).length > 0) {
                // Cache the newest prices into Redis using a Hash
                await redis.hmset('live_prices', newPrices);

                // Push the update to all connected SSE clients instantly
                broadcastToClients(newPrices);
            }
        } catch (error) {
            console.error('[Price Broadcaster] Loop Error:', error.message);
        }
    }, 5000);
};

const stopBroadcasting = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('[Price Broadcaster] Stopped live market data feed.');
    }
};

module.exports = {
    startBroadcasting,
    stopBroadcasting
};
