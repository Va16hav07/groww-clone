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

    console.log('[Price Broadcaster] Starting live market data feed (sequential)...');

    // Poll every 10 seconds to accommodate 1 req/sec limit
    intervalId = setInterval(async () => {
        try {
            const newPrices = {};

            // Changed to sequential to respect the 1 req/sec API limit of Indian Stock API
            for (const symbol of TRACKED_SYMBOLS) {
                try {
                    const price = await stockService.getLatestPrice(symbol);
                    newPrices[symbol] = price;

                    // Wait 1.2 seconds between requests to avoid rate limits
                    await new Promise(resolve => setTimeout(resolve, 1200));
                } catch (err) {
                    console.error(`[Price Broadcaster] Failed to fetch ${symbol}:`, err.message);
                }
            }

            if (Object.keys(newPrices).length > 0) {
                // Cache the newest prices into Redis using a Hash
                await redis.hmset('live_prices', newPrices);

                // Push the update to all connected SSE clients instantly
                broadcastToClients(newPrices);
            }
        } catch (error) {
            console.error('[Price Broadcaster] Loop Error:', error.message);
        }
    }, 10000);
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
