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