const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { config } = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// CORS Middleware - menggunakan config dari env
app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy and running!',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv
    });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const operationalRoutes = require('./routes/operationalRoutes');
const activityRoutes = require('./routes/activityRoutes');
const newsRoutes = require('./routes/newsRoutes');
const homeRoutes = require('./routes/homeRoutes');
const locationRoutes = require('./routes/locationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/operational-hours', operationalRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/locations', locationRoutes);

// 404 Not Found Handler (HARUS setelah semua routes)
app.use(notFoundHandler);

// Global Error Handler (HARUS di paling akhir)
app.use(errorHandler);

module.exports = app;