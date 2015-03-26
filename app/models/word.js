var mongoose = require('mongoose');

var wordSchema = mongoose.Schema({
    word: {type: String, unique: true, id: true},
    count: Number,
    token: String
});

/* Frequency is per mille */
wordSchema.virtual('frequency').get(function() {
    var numberOfWords = this.parent().numberOfWords;
    return ((this.count / numberOfWords) * 1000);
});

module.exports = mongoose.model('Word', wordSchema);