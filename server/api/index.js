const express = require('express')
// const Database = require('better-sqlite3')
// const path = require('path')
// const fs = require('fs')
// const crypto = require('crypto')

const app = express()

// app.use(express.static('../../client'))
// app.use('/uploads', express.static('uploads'))
// app.use(express.json({ limit: '10mb' }))
//
// const uploadsDir = path.join(__dirname, 'uploads')
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir)
// }
//
// const db = new Database('myDatabase.sqlite', { verbose: console.log })
//
// db.prepare(`
//     CREATE TABLE IF NOT EXISTS locations (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT,
//         latitude REAL,
//         longitude REAL,
//         temperature REAL,
//         image_path TEXT,
//         timestamp INTEGER
//     )
// `).run()
//
// const insertStmt = db.prepare(`
//     INSERT INTO locations 
//     (name, latitude, longitude, temperature, image_path, timestamp) 
//     VALUES 
//     (@name, @latitude, @longitude, @temperature, @image_path, @timestamp)
// `)
//
// const selectAllStmt = db.prepare('SELECT * FROM locations')
//
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

// app.post('/api', (req, res) => {
//     try {
//         const data = req.body
//         const timestamp = Date.now()
//
//         const imagePath = data.image64 ? saveBase64Image(data.image64) : null
//
//         const result = insertStmt.run({
//             name: data.name,
//             latitude: data.latitude,
//             longitude: data.longitude,
//             temperature: data.temperature,
//             image_path: imagePath,
//             timestamp: timestamp
//         })
//
//         res.json({
//             status: 'success',
//             id: result.lastInsertRowid,
//             timestamp: timestamp,
//             latitude: data.latitude,
//             longitude: data.longitude,
//             name: data.name,
//             temperature: data.temperature,
//             image_path: imagePath
//         })
//     } catch (error) {
//         console.error('Insert error:', error)
//         res.status(500).json({
//             status: 'error',
//             message: 'Failed to insert data'
//         })
//     }
// })
//
// app.get('/api', (req, res) => {
//     try {
//         const data = selectAllStmt.all()
//         res.json(data)
//     } catch (error) {
//         console.error('Retrieve error:', error)
//         res.status(500).json({
//             status: 'error',
//             message: 'Failed to retrieve data'
//         })
//     }
// })
//
app.get('/api/weather/:latlon', async (req, res) => {
    try {
        const latlon = req.params.latlon.split(',')
        const latitude = latlon[0]
        const longitude = latlon[1]
        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`

        const wetApiRes = await fetch(weatherURL)
        const wetJson = await wetApiRes.json()
        res.setHeader("Access-Control-Allow-Origin", "https://dataselfieapp.vercel.app", "http://localhost:8000/");
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
