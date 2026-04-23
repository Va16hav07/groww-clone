require('dotenv').config();
const http = require('http');
const app = require('./app');
const db = require('./config/db');
const { startBroadcasting, stopBroadcasting } = require('./services/priceBroadcaster');
const { startWorker } = require('./queue/exchangeWorker');
const { connectProducer, ensureTopicsExist } = require('./config/kafkaClient');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

console.log('Server is running');

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Ensure Topics Exist
    await ensureTopicsExist(['orders', 'market-prices', 'failed-orders']);

    await connectProducer();
    await startWorker();

    startBroadcasting();
});
