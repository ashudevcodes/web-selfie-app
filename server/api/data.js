const express = require('express');
const db = require('../database/sqlite');

const router = express.Router();

const insertStmt = db.prepare(`
    INSERT INTO locations 
    (name, latitude, longitude, temperature, image_path, timestamp) 
    VALUES 
    (@name, @latitude, @longitude, @temperature, @image_path, @timestamp)
`);

const selectAllStmt = db.prepare('SELECT * FROM locations');

router.get('/', (req, res) => {
    try {
        console.log("[Data GET Route] Runs")
        const data = selectAllStmt.all();
        res.json(data);
    } catch (error) {
        console.error('Retrieve error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve data' });
    }
});

router.post('/', (req, res) => {
    try {
        console.log("[Data POST Route] Runs")
        const data = req.body;
        const timestamp = Date.now();

        const result = insertStmt.run({
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

module.exports = router;

