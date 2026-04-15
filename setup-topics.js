require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { kafka } = require('./services/order-service/config/kafkaClient');
const admin = kafka.admin();

const run = async () => {
    try {
        await admin.connect();
        const existing = await admin.listTopics();
        const topics = ['orders', 'failed-orders', 'market-prices'];
        const toCreate = topics.filter(t => !existing.includes(t));
        if (toCreate.length > 0) {
            await admin.createTopics({
                topics: toCreate.map(topic => ({ topic, numPartitions: 1 }))
            });
            console.log("Topics created:", toCreate);
        } else {
            console.log("All topics already exist");
        }
        await admin.disconnect();
    } catch(err) {
        console.error("Setup topics failed:", err);
    }
};
run();
