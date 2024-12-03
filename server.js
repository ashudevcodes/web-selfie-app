const express = require('express')
const DataStore = require('nedb')
const app = express()

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

app.listen(8000, () => { console.log("Application Listen at PORT 8000") })
