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
/**
 * Calculate word frequency per millie as a virtual property
 * @function frequency
 * @memberof module:models~wordSchema
 * @this wordSchema
 * @returns {number} frequency per millie
 */
wordSchema.virtual('frequency').get(function() {
    var numberOfWords = this.parent().numberOfWords;
    return ((this.count / numberOfWords) * 1000);
});
/**
 * @module Word
 */
module.exports = mongoose.model('Word', wordSchema);