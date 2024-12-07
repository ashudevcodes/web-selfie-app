const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    temperature: { type: Number, required: true },
    image_path: { type: String },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Location', locationSchema);

