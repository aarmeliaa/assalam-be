const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const { config } = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const swaggerSpec = require('./config/swagger');

const app = express();

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Assalam API Documentation',
}));

// Security Headers (Helmet) - izinkan CDN untuk Swagger UI
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
            imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
            fontSrc: ["'self'", 'cdnjs.cloudflare.com'],
        },
    },
}));

// CORS Middleware - menggunakan config dari env
app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Root route untuk Railway health check
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Assalam API is running',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv
    });
});

// Health Check Endpoint
/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Home]
 *     summary: Health check server
 *     responses:
 *       200:
 *         description: Server berjalan normal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Server is healthy and running!"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: "development"
 */
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