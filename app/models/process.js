var mongoose = require('mongoose');

var processSchema = mongoose.Schema({
    name: {type: String, unique: true},
    started: {type: Date, default: new Date},
    lastRun: {type: Date, default: new Date},
    lastUpdated: {type: Date, default: new Date},
    runs: Number
}, {_id: false});

processSchema.statics.incrementRuns = function(processName, callback) {
    return this.update({name: processName}, [], { $inc: {runs: 1}}, callback);
}

module.exports = mongoose.model('Process', processSchema);