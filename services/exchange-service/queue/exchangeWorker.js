const { createConsumer } = require('../config/kafkaClient');
const Order = require('../models/order.model');
const User = require('../models/user.model');

const consumer = createConsumer('exchange-group');

const startWorker = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'orders', fromBeginning: false });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                let orderId;
                try {
                    const jobData = JSON.parse(message.value.toString());
                    orderId = jobData.orderId;

                    // Simulate Exchange execution delay
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    // Update Postgres Database
                    await Order.updateStatus(orderId, 'EXECUTED');
                    
                    const amountChange = jobData.type === 'BUY' ? -(jobData.price * jobData.quantity) : (jobData.price * jobData.quantity);
                    await User.updateBalance(jobData.userId, amountChange);
                    
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
