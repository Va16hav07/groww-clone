const express = require('express');
const morgan = require('morgan');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { startWorker } = require('./queue/exchangeWorker');

const app = express();
const PORT = process.env.PORT || 5004;

app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Exchange Service (Worker)', status: 'healthy' });
});

app.listen(PORT, async () => {
  try {
    await startWorker();
  } catch (err) {
    console.error(' Exchange Worker failed to start:', err.message);
  }
});
