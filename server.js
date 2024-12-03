const express = require('express')
const { exec } = require('child_process');
const os = require('os')
const DataStore = require('nedb')
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

app.listen(PORT, () => {
    console.log(`Application Listen at PORT ${PORT}`)
    switch (os.platform()) {
        case 'linux':
            exec(`xdg-open http://localhost:${PORT}`)
            break;
        case 'win32':
            exec(`start http://localhost:${PORT}`)
            break;
        case 'darwin':
            exec(`open http://localhost:${PORT}`)
            break;
        default:
            break;
    }
})
