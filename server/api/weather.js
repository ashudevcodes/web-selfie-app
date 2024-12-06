const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/:latlon', async (req, res) => {
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

module.exports = router;

