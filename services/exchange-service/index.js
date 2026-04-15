const express = require('express');
const morgan = require('morgan');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { startWorker } = require('./queue/exchangeWorker');

const app = express();
const PORT = 5004;

app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Exchange Service (Worker)', status: 'healthy' });
});

app.listen(PORT, async () => {
  console.log(`📡 Exchange Service (Worker) running health-check on port ${PORT}`);
  try {
    await startWorker();
    console.log('✅ Exchange Worker initialized and listening to Kafka');
  } catch (err) {
    console.error('❌ Exchange Worker failed to start:', err.message);
  }
});
