const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'groww-clone',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();
const admin = kafka.admin();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('[Kafka] Producer connected successfully');
  } catch (error) {
    console.error('[Kafka] Producer connection error:', error);
  }
};

const disconnectProducer = async () => {
    await producer.disconnect();
};

const createConsumer = (groupId) => {
    return kafka.consumer({ groupId });
};

const ensureTopicsExist = async (topics) => {
    try {
        await admin.connect();
        const existingTopics = await admin.listTopics();
        const topicsToCreate = topics.filter(t => !existingTopics.includes(t));
        
        if (topicsToCreate.length > 0) {
            await admin.createTopics({
                topics: topicsToCreate.map(topic => ({ topic, numPartitions: 1 }))
            });
            console.log(`[Kafka Admin] Created missing topics: ${topicsToCreate.join(', ')}`);
        }
    } catch (error) {
        console.error('[Kafka Admin] Failed to create topics:', error);
    } finally {
        await admin.disconnect();
    }
};

module.exports = {
  kafka,
  producer,
  connectProducer,
  disconnectProducer,
  createConsumer,
  ensureTopicsExist
};
