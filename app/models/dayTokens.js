var mongoose = require('mongoose');
/**
 * Mongo schema for dayTokens model
 * @class dayTokensSchema
 */
var dayTokensSchema = mongoose.Schema({
    date: {type: Date, default: new Date},
    tokens: [String]
});
/**
 * @module dayTokens
 */
module.exports = mongoose.model('dayTokens', dayTokensSchema);