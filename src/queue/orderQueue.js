const { Queue } = require('bullmq');
const Redis = require('ioredis');

// Setup Redis connection (assumes default localhost:6379 from Docker)
const connection = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null
});

// Define the queue
const ordersQueue = new Queue('OrdersQueue', { connection });

console.log('Orders Queue initialized.');

module.exports = ordersQueue;
