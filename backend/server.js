// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Weather API Endpoint
app.get('/api/weather', async (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
            return res.status(400).json({ error: 'Location parameter is required' });
        }

        const response = await axios.get(
            `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPI_KEY}&q=${location}&days=6&aqi=yes&alerts=no`
            // The change is here: aqi=yes
        );

        res.json(response.data);
    } catch (error) {
        console.error('Weather API Error:', error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || 'Failed to fetch weather data';
        res.status(status).json({ error: message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});