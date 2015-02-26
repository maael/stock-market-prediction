var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
    name: String,
    symbol: String,
    market: String
});

module.exports = mongoose.model('Company', companySchema);