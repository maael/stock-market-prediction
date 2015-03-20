var frequency = require('word-frequency'),
    Word = require('../models/word'),
    WordList = require('../models/wordList'),
    mongoose = require('mongoose'),
    dbConfig = require('../../config/db');
mongoose.connect(dbConfig.url);
var lexicalAnalyser = function (text) {
    var frequencies = frequency(text),
        words = [];
    WordList.findOne(function(err, wordList) {
        if(!wordList) {
            wordList = new WordList({
                numberOfWords: 0,
                words: []
            });
        }
        for(var word in frequencies) {
            var foundWord = wordList.words.filter(function(w) {
                return (w.word === word);
            });
            if(foundWord.length > 0) {
                foundWord[0].count += frequencies[word];
            } else {
                var newWord = new Word({
                    word: word,
                    count: frequencies[word]
                });
                wordList.words.push(newWord);
            }
            wordList.numberOfWords += frequencies[word];
        }
        wordList.save(function(err) {
            if(err) { throw err; }
        });
    });
};
module.exports = lexicalAnalyser;