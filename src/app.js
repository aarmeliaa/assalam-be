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
app.use('/api/operational-hours', operationalRoutes);

module.exports = app;