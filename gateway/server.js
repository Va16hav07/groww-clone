const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');

const app = express();
const PORT = 8001;

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  clientId: 'exchange-mock',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});
const producer = kafka.producer();
const admin = kafka.admin();

const marketState = {
  RELIANCE: { NSE: 1384.80, BSE: 1384.25 },
  TCS:      { NSE: 2356.00, BSE: 2355.45 },
  HDFCBANK: { NSE: 798.20,  BSE: 797.65 },
  INFY:     { NSE: 1220.80, BSE: 1220.25 }
};

const startGateway = async () => {
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    if (!topics.includes('market-prices')) {
      await admin.createTopics({ topics: [{ topic: 'market-prices', numPartitions: 1 }] });
      console.log('[Dummy Gateway] Created market-prices topic');
    }
    await admin.disconnect();

    await producer.connect();
    console.log('[Dummy Gateway] Connected to Kafka Producer');
  } catch(err) {
    console.error('[Dummy Gateway] Kafka connection failed:', err);
  }

  setInterval(async () => {
    const messages = [];
    for (const symbol in marketState) {
      const driftPercentage = (Math.random() * 0.10) - 0.05; 
      
      marketState[symbol].NSE += marketState[symbol].NSE * driftPercentage;
      marketState[symbol].BSE += marketState[symbol].BSE * driftPercentage;

      messages.push({
          key: symbol,
          value: JSON.stringify({
              symbol,
              price: {
                  NSE: parseFloat(marketState[symbol].NSE.toFixed(2)),
                  BSE: parseFloat(marketState[symbol].BSE.toFixed(2))
              }
          })
      });
    }

    try {
      await producer.send({
          topic: 'market-prices',
          messages
      });
    } catch (err) {
      console.error('[Dummy Gateway] Failed to publish prices to Kafka:', err.message);
    }
  }, 5000);

  app.get('/stock', (req, res) => {
    const symbol = req.query.name;
    
    if (!symbol) {
      return res.status(400).json({ error: "Missing symbol name query parameter" });
    }

    if (!marketState[symbol]) {
      return res.json({
        currentPrice: { NSE: 100.00, BSE: 99.50 }
      });
    }

    res.json({
      currentPrice: {
        NSE: parseFloat(marketState[symbol].NSE.toFixed(2)),
        BSE: parseFloat(marketState[symbol].BSE.toFixed(2))
      }
    });
  });

  app.listen(PORT, () => {
    console.log(`[Dummy Gateway] Mock Indian Stock API running on http://localhost:${PORT}`);
    console.log(`[Dummy Gateway] Prices ticking every 5 seconds to Kafka.`);
  });
};

startGateway().catch(console.error);
