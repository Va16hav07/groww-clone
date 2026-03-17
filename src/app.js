const express = require('express');
const cors = require('cors');

// Import routes
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');

// Import middlewares
const { apiLimiter } = require('./middleware/rateLimit.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to all api routes
app.use('/api', apiLimiter);

// Register routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

// Catch-all specific to 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

module.exports = app;
