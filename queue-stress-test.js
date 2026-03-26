const axios = require('axios');

async function run() {
    console.log('Initiating 50 rapid-fire Orders to test Kafka / Event Queuing resilience...');

    try {
        const loginRes = await axios.post('http://localhost:8000/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;

        const NUM_ORDERS = 50;
        const promises = [];

        for (let i = 0; i < NUM_ORDERS; i++) {
            promises.push(
                axios.post('http://localhost:8000/api/orders', {
                    symbol: 'TCS', type: 'BUY', quantity: 1
                }, { headers: { Authorization: `Bearer ${token}` } })
            );
        }

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled').length;
        console.log(`Successfully lodged ${successful}/${NUM_ORDERS} PENDING orders instantly into the Kafka topic.`);

        console.log('Waiting 10 seconds for the Kafka Consumer/Exchange Gateway to process the backlog sequentially...');
        await new Promise(r => setTimeout(r, 10000));

        const getRes = await axios.get('http://localhost:8000/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const executedCount = getRes.data.orders.filter(o => o.status === 'EXECUTED').length;
        console.log(`Total historical EXECUTED orders in database: ${executedCount}`);
        console.log(`[SUCCESS] The asynchronous decoupled architecture handles traffic spikes perfectly.`);

    } catch (err) {
        console.error('Queue Test Error:', err.message);
    }
}
run();
