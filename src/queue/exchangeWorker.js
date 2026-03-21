const { Worker } = require('bullmq');
const Redis = require('ioredis');
const Order = require('../models/order.model');

// Setup Redis connection (assumes default localhost:6379 from Docker)
const connection = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null
});

// Define the worker
const worker = new Worker('OrdersQueue', async job => {
    const { orderId } = job.data;
    console.log(`[Exchange Gateway] Received order: ${orderId}. Processing...`);

    // Simulate Exchange execution delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update Postgres Database
    try {
        const updatedOrder = await Order.updateStatus(orderId, 'EXECUTED');
        console.log(`[Exchange Gateway] Order ${orderId} executed!`);
        return updatedOrder;
    } catch (err) {
        console.error(`[Exchange Gateway] Failed to execute order ${orderId}:`, err);
        throw err;
    }
}, { connection });

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} has failed with ${err.message}`);
    if (job.data && job.data.orderId) {
        Order.updateStatus(job.data.orderId, 'FAILED').catch(console.error);
    }
});

console.log('Exchange Worker Listening for Orders...');

module.exports = worker;
