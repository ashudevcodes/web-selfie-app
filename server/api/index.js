const express = require('express')
require('dotenv').config();
const Database = require('better-sqlite3')
// const path = require('path')
// const fs = require('fs')
// const crypto = require('crypto')
const cors = require('cors');

const app = express()


app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

// app.use('/uploads', express.static('uploads'))
// app.use(express.json({ limit: '10mb' }))
//
// const uploadsDir = path.join(__dirname, 'uploads')
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir)
// }
//

const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/myDatabase.sqlite' : 'myDatabase.sqlite';
const db = new Database(dbPath, { verbose: console.log });

db.prepare(`
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        latitude REAL,
        longitude REAL,
        temperature REAL,
        image_path TEXT,
        timestamp INTEGER
    )
`).run()


const insertStmt = db.prepare(`
    INSERT INTO locations 
    (name, latitude, longitude, temperature, image_path, timestamp) 
    VALUES 
    (@name, @latitude, @longitude, @temperature, @image_path, @timestamp)
`)

const selectAllStmt = db.prepare('SELECT * FROM locations')

// function saveBase64Image(base64Data) {
//     const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '')
//
//     const filename = `${crypto.randomBytes(16).toString('hex')}.png`
//     const filepath = path.join(uploadsDir, filename)
//
//     fs.writeFileSync(filepath, Buffer.from(base64Image, 'base64'))
//
//     return `/uploads/${filename}`
// }



app.post('/data', (req, res) => {
    try {
        const data = req.body
        const timestamp = Date.now()

        // const imagePath = data.image64 ? saveBase64Image(data.image64) : null

        const result = insertStmt.run({
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
            temperature: data.temperature,
            image_path: data.image64,
            timestamp: timestamp
        })

        res.send({
            status: 'success',
            id: result.lastInsertRowid,
            timestamp: timestamp,
            latitude: data.latitude,
            longitude: data.longitude,
            name: data.name,
            temperature: data.temperature,
            image_path: data.image64
        })
    } catch (error) {
        console.error('Insert error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to insert data',
            error: error.message,
        });
    }
})

app.get('/data', (req, res) => {
    try {
        const data = selectAllStmt.all()
        res.json(data)
    } catch (error) {
        console.error('Insert error:', error)
        res.send({ message: "hello" })
        res.status(500).json({
            status: 'error',
            message: 'Failed to insert data'
        })
    }
})

app.get('/api/weather/:latlon', async (req, res) => {
    try {
        const latlon = req.params.latlon.split(',')
        const latitude = latlon[0]
        const longitude = latlon[1]
        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`

        const wetApiRes = await fetch(weatherURL)
        const wetJson = await wetApiRes.json()
        res.json(wetJson)
    } catch (error) {
        console.error('Weather API error:', error)
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch weather data'
        });
    }
})

app.get("/", (req, res) => res.send("Express on Vercel"));


app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app
