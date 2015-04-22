var mongoose = require('mongoose');
/**
 * Mongo schema for Process model
 * @class processSchema
 */
var processSchema = mongoose.Schema({
    name: {type: String, unique: true},
    started: {type: Date, default: new Date},
    lastRun: {type: Date, default: new Date},
    lastUpdated: {type: Date, default: new Date},
    runs: Number
}, {_id: false});
/**
 * Increment the stored runs for a process, based on processName
 * @function incrementRuns
 * @memberof module:Process~processSchema
 * @this processSchema
 * @param {string} processName - name of process to increment
 * @param {function} callback - function to call after incrementing runs
 * @see {@link https://www.npmjs.com/package/bcrypt-nodejs}
 */
processSchema.statics.incrementRuns = function(processName, callback) {
    return this.update({name: processName}, [], { $inc: {runs: 1}}, callback);
}
/**
 * @module Process
 */
module.exports = mongoose.model('Process', processSchema);