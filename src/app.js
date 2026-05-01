const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy and running!'
    });
});

const operationalRoutes = require('./routes/operationalRoutes');
const activityRoutes = require('./routes/activityRoutes');
const newsRoutes = require('./routes/newsRoutes');
const homeRoutes = require('./routes/homeRoutes');
const locationRoutes = require('./routes/locationRoutes');

app.use('/api/operational-hours', operationalRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/locations', locationRoutes);

module.exports = app;