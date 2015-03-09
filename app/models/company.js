var mongoose = require('mongoose'),
    MarketData = require('./marketData');

var companySchema = mongoose.Schema({
    name: String,
    symbol: String,
    market: String,
    quotes: [],
    historicalData: [MarketData.schema]
});

module.exports = mongoose.model('Company', companySchema);