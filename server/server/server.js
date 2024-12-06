const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./api');

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

app.use('/api', apiRoutes);

app.get('/', (req, res) => res.send('Express on Vercel'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;

