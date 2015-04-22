var mongoose = require('mongoose');
/**
 * Mongo schema for MarketData model
 * @class marketDataSchema
 */
var marketDataSchema = mongoose.Schema({
    date: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    adjClose: Number
});
/**
 * @module MarketData
 */
module.exports = mongoose.model('MarketData', marketDataSchema);