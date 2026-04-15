const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({ path: require('path').resolve(__dirname, './../../.env') });
const orderRoutes = require('./routes/order.routes');
const portfolioRoutes = require('./routes/portfolio.routes');
const { connectProducer, ensureTopicsExist } = require('./config/kafkaClient');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Order Service', status: 'healthy' });
});

app.listen(PORT, async () => {
  console.log(`📦 Order Management Service (OMS) running on port ${PORT}`);
  try {
    await connectProducer();
    await ensureTopicsExist(['orders', 'failed-orders']);
    console.log('✅ Kafka Producer connected to OMS & topics ensured.');
  } catch (err) {
    console.error('❌ Kafka Producer connection failed in OMS:', err.message);
  }
});
