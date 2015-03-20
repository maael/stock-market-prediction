var mongoose = require('mongoose');

var processSchema = mongoose.Schema({
    name: {type: String, unique: true},
    started: {type: Date, default: new Date},
    lastRun: {type: Date, default: new Date},
    lastUpdated: {type: Date, default: new Date},
    runs: Number
}, {_id: false});

module.exports = mongoose.model('Process', processSchema);