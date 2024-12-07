require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const db = require('../database/sqlite');


const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

const insertStmt = db.prepare(`
    INSERT INTO locations 
    (name, latitude, longitude, temperature, image_path, timestamp) 
    VALUES 
    (@name, @latitude, @longitude, @temperature, @image_path, @timestamp)
`);

const selectAllStmt = db.prepare('SELECT * FROM locations');

app.get('/', (req, res) => res.send('Express on Vercel'));

app.get('/getlocdata', (req, res) => {
    try {
        console.log("[Data GET Route] Runs")
        const data = selectAllStmt.all();
        res.json(data);
    } catch (error) {
        console.error('Retrieve error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve data' });
    }
});

app.post('/postlocdata', (req, res) => {
    try {
        console.log("[Data POST Route] Runs")
        const data = req.body;
        const timestamp = Date.now();
        console.log(data.name)

        let result
        result = insertStmt.run({
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
            temperature: data.temperature,
            image_path: data.image64 || null,
            timestamp,
        });
        res.json({
            status: 'success',
            id: result.lastInsertRowid,
            timestamp,
            ...data,
        });

    } catch (error) {
        console.error('Insert error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to insert data' });
    }
});

app.get('/weather/:latlon', async (req, res) => {
    try {
        console.log('[GET] Wether Data')
        console.log(req.params.latlon.split(','))
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
