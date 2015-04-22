var mongoose = require('mongoose'),
    MarketData = require('./marketData');
/**
 * Mongo schema for Company model
 * @class companySchema
 */
var companySchema = mongoose.Schema({
    name: String,
    symbol: String,
    market: String,
    quotes: [],
    historicalData: [MarketData.schema]
});
/**
 * @module Company
 */
module.exports = mongoose.model('Company', companySchema);