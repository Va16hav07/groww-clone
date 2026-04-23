const Redis = require('ioredis');

// Redis to fetch the latest cached prices
const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
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

    res.write('data: {"message": "Streaming connected"}\n\n');

    // Immediately send the latest cached prices if they exist
    try {
        const cachedPrices = await redis.hgetall('live_prices');
        if (cachedPrices && Object.keys(cachedPrices).length > 0) {
            res.write(`data: ${JSON.stringify(cachedPrices)}\n\n`);
        }
    } catch (error) {
        console.error('Error fetching initial cached prices:', error.message);
    }

    // Handle client disconnects natively
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
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

exports.getHistory = async (req, res) => {
    try {
        const cachedHistory = await redis.hgetall('live_history');
        const historyMap = {};
        for (const [symbol, histStr] of Object.entries(cachedHistory)) {
            historyMap[symbol] = JSON.parse(histStr);
        }
        res.json({ history: historyMap });
    } catch (error) {
        console.error('Error fetching history:', error.message);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

exports.getHistoricalData = async (req, res) => {
    try {
        const { symbol, timeframe } = req.query;
        if (!symbol || !timeframe) return res.status(400).json({ error: 'Missing symbol or timeframe' });
        
        let currentPrice = 1000;
        try {
            const livePrices = await redis.hgetall('live_prices');
            if (livePrices && livePrices[symbol]) {
                currentPrice = parseFloat(livePrices[symbol]);
            }
        } catch(e) {}

        const now = Date.now();
        const candles = [];
        const numCandles = 40; 
        
        const timeFrames = {
            '1W': 7 * 24 * 60 * 60 * 1000,
            '1M': 30 * 24 * 60 * 60 * 1000,
            '1Y': 365 * 24 * 60 * 60 * 1000,
            '5Y': 5 * 365 * 24 * 60 * 60 * 1000,
            'ALL': 10 * 365 * 24 * 60 * 60 * 1000
        };
        const timeSpan = timeFrames[timeframe] || timeFrames['1W'];
        const interval = timeSpan / numCandles;
        
        // Scale volatility based on timeframe (longer timeframe = more fluctuation)
        const volatility = timeframe === 'ALL' || timeframe === '5Y' ? 0.05 : (timeframe === '1Y' ? 0.015 : 0.005);
        
        let priceCursor = currentPrice;
        for (let i = numCandles - 1; i >= 0; i--) {
            const open = priceCursor * (1 + (Math.random() * volatility * 2 - volatility));
            const close = priceCursor;
            const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
            const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
            
            candles[i] = {
                open,
                high,
                low,
                close,
                timestamp: now - ((numCandles - 1 - i) * interval)
            };
            priceCursor = open;
        }
        res.json({ history: candles });
    } catch (error) {
        console.error('Error generating historical mock data:', error.message);
        res.status(500).json({ error: 'Failed to generate history' });
    }
};
