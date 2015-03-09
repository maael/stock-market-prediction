var mongoose = require('mongoose');

var marketDataSchema = mongoose.Schema({
    date: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    adjClose: Number
});

module.exports = mongoose.model('MarketData', marketDataSchema);