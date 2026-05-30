const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://assalam-fe.vercel.app/'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy and running!'
    });
});

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

module.exports = app;