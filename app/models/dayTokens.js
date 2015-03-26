var mongoose = require('mongoose');

var dayTokensSchema = mongoose.Schema({
    date: {type: Date, default: new Date},
    tokens: [String]
});

module.exports = mongoose.model('dayTokens', dayTokensSchema);