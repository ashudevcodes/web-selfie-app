const express = require('express');

const dataRoutes = require('./data');
const weatherRoutes = require('./weather');

const router = express.Router();

router.use('/data', dataRoutes);
router.use('/weather', weatherRoutes);

module.exports = router;
