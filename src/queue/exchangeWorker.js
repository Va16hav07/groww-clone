const { createConsumer } = require('../config/kafkaClient');
const Order = require('../models/order.model');

const consumer = createConsumer('exchange-group');

const startWorker = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'orders', fromBeginning: false });

        console.log('[Exchange Gateway] Listening for Orders on Kafka...');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                let orderId;
                try {
                    const jobData = JSON.parse(message.value.toString());
                    orderId = jobData.orderId;
                    console.log(`[Exchange Gateway] Received order: ${orderId}. Processing...`);

                    // Simulate Exchange execution delay
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    // Update Postgres Database
                    await Order.updateStatus(orderId, 'EXECUTED');
                    console.log(`[Exchange Gateway] Order ${orderId} executed!`);
                } catch (err) {
                    console.error(`[Exchange Gateway] Failed to execute order ${orderId || 'unknown'}:`, err);
                    if (orderId) {
                        try {
                            await Order.updateStatus(orderId, 'FAILED');
                            const { producer } = require('../config/kafkaClient');
                            await producer.send({
                                topic: 'failed-orders',
                                messages: [{ value: JSON.stringify({ orderId, error: err.message || 'Execution Failed' }) }]
                            });
                            console.log(`[DLQ] Order ${orderId} routed to Dead-Letter Queue.`);
                        } catch (fatalErr) {
                            console.error('[DLQ] Fatal failure:', fatalErr);
                        }
                    }
                }
            },
        });
    } catch (err) {
        console.error('[Exchange Gateway] Consumer initialization error:', err);
    }
};

module.exports = { startWorker };
