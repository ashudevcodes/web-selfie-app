const express = require('express')
const fetch = require('node-fetch')
const { exec } = require('child_process');
const os = require('os')
const DataStore = require('nedb');
const app = express()
const PORT = 6969
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))

const database = new DataStore('database.db')
database.loadDatabase()


app.post('/api', (req, res) => {
    const data = req.body
    const timestemp = Date.now()
    data.timestemp = timestemp
    database.insert(data)
    res.json({
        status: 'susesses',
        timestemp: timestemp,
        latitude: data.latitude,
        longitube: data.longitube,
        name: data.name,
        temperature: data.temperature,
        image: data.image64,
    })
    res.end()
})

app.get('/api', (req, res) => {
    database.find({}, (err, data) => {
        if (err) {
            res.end()
            return
        }
        res.json(data)
    })
})

app.get('/api/weather/:latlon', async (req, res) => {
    const latlon = req.params.latlon.split(',')
    const latitude = latlon[0]
    const longitude = latlon[1]
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
    const wetApiRes = await fetch(weatherURL)
    const wetJson = await wetApiRes.json()
    console.log(wetJson)
    res.json(wetJson)
})

let openState = true
app.listen(PORT, () => {
    console.log(`Application Listen at PORT ${PORT}`)
    console.log(openState)
    if (openState) {
        switch (os.platform()) {
            case 'linux':
                exec(`xdg-open http://localhost:${PORT}`)
                openState = false
                break;
            case 'win32':
                exec(`start http://localhost:${PORT}`)
                openState = false
                break;
            case 'darwin':
                exec(`open http://localhost:${PORT}`)
                openState = false
                break;
            default:
                break;
        }
    }
})
