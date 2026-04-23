const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const certPath = path.resolve(__dirname, '../../../certs');

const sslOptions = process.env.KAFKA_SSL === 'true' ? {
  rejectUnauthorized: true,
  ca: [fs.readFileSync(`${certPath}/ca.pem`, 'utf-8')],
  key: fs.readFileSync(`${certPath}/service.key`, 'utf-8'),
  cert: fs.readFileSync(`${certPath}/service.cert`, 'utf-8'),
} : undefined;

const kafka = new Kafka({
  clientId: 'groww-clone',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  ssl: sslOptions
});

const producer = kafka.producer();
const admin = kafka.admin();

const connectProducer = async () => {
  try {
    await producer.connect();
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
