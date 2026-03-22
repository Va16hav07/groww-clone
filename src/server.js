require('dotenv').config();
const http = require('http');
const app = require('./app');
const db = require('./config/db');
const { startBroadcasting, stopBroadcasting } = require('./services/priceBroadcaster');
require('./queue/exchangeWorker'); // Initialize consumer worker

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

console.log('Server is running');

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    // Start background live market feed
    startBroadcasting();
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    server.close(() => {
        console.log('Http server closed.');
        // Stop background loops
        stopBroadcasting();
        // close database connection
        db.end(() => {
            console.log('PostgreSQL database connection closed.');
            process.exit(0);
        });
    });
});
