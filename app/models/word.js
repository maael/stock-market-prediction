var mongoose = require('mongoose');
/**
 * Mongo schema for Word model
 * @class wordSchema
 */
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
/**
 * @module Word
 */
module.exports = mongoose.model('Word', wordSchema);