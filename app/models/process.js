var mongoose = require('mongoose');

var processSchema = mongoose.Schema({
    name: String,
    started: {type: Date, default: new Date},
    lastRun: {type: Date, default: new Date},
    runs: Number
});

module.exports = mongoose.model('Process', processSchema);