const Redis = require('ioredis');

// Redis to fetch the latest cached prices
const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null
});

// Store active client connections
let clients = [];

// SSE Endpoint
exports.streamPrices = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); 

    clients.push(res);

    console.log(`[SSE] Client connected. Total clients: ${clients.length}`);
    res.write('{"message": "Streaming connected"}');

    // Immediately send the latest cached prices if they exist
    try {
        const cachedPrices = await redis.hgetall('live_prices');
        if (Object.keys(cachedPrices).length > 0) {
            res.write(`data: ${JSON.stringify(cachedPrices)}\n\n`);
        }
    } catch (error) {
        console.error('Error fetching initial cached prices:', error.message);
    }

    // Handle client disconnects natively
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
        console.log(`[SSE] Client disconnected. Total clients: ${clients.length}`);
    });
};

// Internal function called by the Broadcaster loop to push new prices to all clients
exports.broadcastToClients = (newPrices) => {
    if (clients.length === 0) return;
    const dataString = `data: ${JSON.stringify(newPrices)}\n\n`;
    clients.forEach(client => {
        client.write(dataString);
    });
};
