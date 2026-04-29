const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

const certPath = path.resolve(__dirname, '../certs');

const sslOptions = process.env.KAFKA_SSL === 'true' ? {
  rejectUnauthorized: true,
  ca: [fs.readFileSync(`${certPath}/ca.pem`, 'utf-8')],
  key: fs.readFileSync(`${certPath}/service.key`, 'utf-8'),
  cert: fs.readFileSync(`${certPath}/service.cert`, 'utf-8'),
} : undefined;

const kafka = new Kafka({
  clientId: 'exchange-mock',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  ssl: sslOptions
});
const producer = kafka.producer();
const admin = kafka.admin();

const initialMarketState = {
  RELIANCE: { NSE: 1384.80, BSE: 1384.25 },
  TCS:      { NSE: 2356.00, BSE: 2355.45 },
  HDFCBANK: { NSE: 798.20,  BSE: 797.65 },
  INFY:     { NSE: 1220.80, BSE: 1220.25 }
};

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
    }
    await admin.disconnect();

    await producer.connect();
  } catch(err) {
    console.error('[Dummy Gateway] Kafka connection failed:', err);
  }

  setInterval(async () => {
    const messages = [];
    for (const symbol in marketState) {
      // Reduced volatility: -0.005 to +0.005 (0.5% max movement per tick)
      const driftPercentage = (Math.random() * 0.01) - 0.005; 
      
      marketState[symbol].NSE += marketState[symbol].NSE * driftPercentage;
      marketState[symbol].BSE += marketState[symbol].BSE * driftPercentage;

      // Add a simple mean-reversion force to prevent prices from dropping to 0 or exploding
      const nseDiff = initialMarketState[symbol].NSE - marketState[symbol].NSE;
      const bseDiff = initialMarketState[symbol].BSE - marketState[symbol].BSE;
      
      marketState[symbol].NSE += nseDiff * 0.02; // pull 2% towards initial price
      marketState[symbol].BSE += bseDiff * 0.02;

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
  });
};

startGateway().catch(console.error);
