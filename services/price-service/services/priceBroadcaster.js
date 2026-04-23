const Redis = require('ioredis');
const { createConsumer } = require('../config/kafkaClient');
const { broadcastToClients } = require('../controllers/price.controller');

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

const consumer = createConsumer('price-broadcaster-group');

const startBroadcasting = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'market-prices', fromBeginning: false });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    const symbol = data.symbol;
                    const livePrice = data.price.NSE;

                    const newPrices = { [symbol]: livePrice };

                    // Update live_history
                    const rawHistory = await redis.hget('live_history', symbol);
                    let stockHistory = rawHistory ? JSON.parse(rawHistory) : [];
                    
                    const now = Date.now();
                    const lastCandle = stockHistory[stockHistory.length - 1];
                    
                    if (!lastCandle || (now - lastCandle.timestamp) > 10000) {
                        const newCandle = {
                            open: lastCandle ? lastCandle.close : livePrice,
                            high: Math.max(lastCandle ? lastCandle.close : livePrice, livePrice),
                            low: Math.min(lastCandle ? lastCandle.close : livePrice, livePrice),
                            close: livePrice,
                            timestamp: now,
                        };
                        stockHistory.push(newCandle);
                        if (stockHistory.length > 40) stockHistory = stockHistory.slice(-40);
                    } else {
                        lastCandle.close = livePrice;
                        lastCandle.high = Math.max(lastCandle.high, livePrice);
                        lastCandle.low = Math.min(lastCandle.low, livePrice);
                        stockHistory[stockHistory.length - 1] = lastCandle;
                    }
                    
                    await redis.hset('live_history', symbol, JSON.stringify(stockHistory));

                    // Cache the newest prices into Redis using a Hash
                    await redis.hset('live_prices', newPrices);

                    // Push the update to all connected SSE clients instantly
                    broadcastToClients(newPrices);
                } catch (err) {
                    console.error('[Price Broadcaster] Message Processing Error:', err.message);
                }
            },
        });
    } catch (err) {
        console.error('[Price Broadcaster] Consumer initialization error:', err);
    }
};

const stopBroadcasting = async () => {
    try {
        await consumer.disconnect();
    } catch (err) {
        console.error('[Price Broadcaster] Disconnect error:', err);
    }
};

module.exports = {
    startBroadcasting,
    stopBroadcasting
};
