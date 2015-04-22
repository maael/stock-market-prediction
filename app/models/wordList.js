var mongoose = require('mongoose'),
    Word = require('./word');
/**
 * Mongo schema for WordList model
 * @class wordListSchema
 */
var wordListSchema = mongoose.Schema({
    numberOfWords: Number,
    words: [Word.schema]
});
/**
 * Calculate word frequency per millie as a virtual property
 * @function frequency
 * @memberof module:models~wordListSchema
 * @this wordListSchema
 * @param {number} threshold - lower limit for word frequencies to use as a stop word
 * @param {function} cb - callback function - not used
 * @returns {string[]} stop word list
 */
wordListSchema.statics.stopList = function stopList(threshold, cb) {
    var stopListArr = [];
    for(var i = 0; i < this.words.length; i++) {
        var word = this.words[i];
        if(word.frequency > threshold) {
            stopListArr.push(word);
        }
    }
    return stopListArr;
}
/**
 * @module WordList
 */
module.exports = mongoose.model('WordList', wordListSchema);