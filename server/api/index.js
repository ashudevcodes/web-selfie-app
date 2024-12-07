require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => res.send('Express on Vercel'));

app.get('/weather/:latlon', async (req, res) => {
    try {
        const [latitude, longitude] = req.params.latlon.split(',');
        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;

        const response = await fetch(weatherURL);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch weather data' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
