const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'User Service', status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`👤 User Service running on port ${PORT}`);
});
