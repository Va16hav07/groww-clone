const Redis = require('ioredis');
const { createConsumer } = require('../config/kafkaClient');
const { broadcastToClients } = require('../controllers/price.controller');

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null
});

const consumer = createConsumer('price-broadcaster-group');

const startBroadcasting = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'market-prices', fromBeginning: false });

        console.log('[Price Broadcaster] Connected to Kafka. Listening for live prices...');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    const symbol = data.symbol;
                    const livePrice = data.price.NSE; 
                    
                    const newPrices = { [symbol]: livePrice };

                    // Cache the newest prices into Redis using a Hash
                    await redis.hmset('live_prices', newPrices);

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
        console.log('[Price Broadcaster] Stopped live market data feed.');
    } catch (err) {
        console.error('[Price Broadcaster] Disconnect error:', err);
    }
};

module.exports = {
    startBroadcasting,
    stopBroadcasting
};
