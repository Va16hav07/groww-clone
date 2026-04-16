const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(morgan('dev'));

// Auth Middleware (Centralized)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      // Set a special header to pass the userId to downstream services
      req.headers['x-user-id'] = decoded.id;
      next();
    } catch (err) {
      console.error('[Gateway] Auth failed:', err.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  } else {
    // Some routes might not need auth (like /api/auth/login, /api/auth/signup)
    // Downstream service will handle missing x-user-id if needed
    next();
  }
};

// Route Mapping (Initially all point to the Monolith on Port 8005)
const USER_SERVICE_URL = 'http://localhost:5001';
const ORDER_SERVICE_URL = 'http://localhost:5002';
const PRICE_SERVICE_URL = 'http://localhost:5003';

// Helper to create proxy options
const getProxyOptions = (target) => ({
  target,
  changeOrigin: true,
  ws: true,
  onProxyReq: (proxyReq, req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        proxyReq.setHeader('x-user-id', decoded.id);
      } catch (err) {}
    }
  }
});

// Route Mapping (Explicitly preserving full /api/... paths)
app.use(createProxyMiddleware({
  ...getProxyOptions(USER_SERVICE_URL),
  pathFilter: '/api/auth'
}));

app.use(createProxyMiddleware({
  ...getProxyOptions(ORDER_SERVICE_URL),
  pathFilter: ['/api/orders', '/api/portfolio'],
  // Apply authMiddleware manually for these routes
  onProxyReq: (proxyReq, req) => {
    // Inject user id from our gateway auth logic
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        proxyReq.setHeader('x-user-id', decoded.id);
      } catch (err) {}
    }
  }
}));

app.use(createProxyMiddleware({
  ...getProxyOptions(PRICE_SERVICE_URL),
  pathFilter: '/api/prices'
}));

// Standard health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is healthy' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`👤 User Service: ${USER_SERVICE_URL}`);
  console.log(`📦 Order Service: ${ORDER_SERVICE_URL}`);
  console.log(`📡 Price Service: ${PRICE_SERVICE_URL}`);
});
