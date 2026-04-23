const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const priceRoutes = require('./routes/price.routes');
const { startBroadcasting } = require('./services/priceBroadcaster');

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/prices', priceRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Price Service', status: 'healthy' });
});

app.listen(PORT, async () => {
  console.log(`Price Service running on port ${PORT}`);
  await startBroadcasting();
});
