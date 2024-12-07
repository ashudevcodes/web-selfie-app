require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { body, validationResult } = require('express-validator');
const connectDB = require('../database/mongo');
const Location = require('../models/Location');

const app = express();
connectDB();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => res.send('Express on Vercel'));

app.post(
    '/postlocdata',
    body('name').isEmail().withMessage('Name must be a valid email'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', errors: errors.array() });
        }

        try {
            const { name, latitude, longitude, temperature, image64 } = req.body;

            const newLocation = new Location({
                name,
                latitude,
                longitude,
                temperature,
                image_path: image64 || null,
            });

            const savedLocation = await newLocation.save();
            res.json({ status: 'success', id: savedLocation._id, ...savedLocation._doc });
        } catch (error) {
            console.error('Insert error:', error);
            res.status(500).json({ status: 'error', message: 'Failed to insert data' });
        }
    }
);

app.get('/getlocdata', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (error) {
        console.error('Retrieve error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve data' });
    }
});

app.post('/postdel', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ status: 'error', message: 'No ID provided for deletion' });

        const deletedLocation = await Location.findByIdAndDelete(id);
        if (!deletedLocation) return res.status(404).json({ status: 'error', message: 'No location found with the given ID' });

        res.json({ status: 'success', message: 'Location deleted successfully', id });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete location' });
    }
});

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
