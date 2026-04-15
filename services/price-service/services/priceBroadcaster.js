const { Redis } = require('@upstash/redis');
const { createConsumer } = require('../config/kafkaClient');
const { broadcastToClients } = require('../controllers/price.controller');

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
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
