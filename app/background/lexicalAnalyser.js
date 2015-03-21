var frequency = require('word-frequency'),
    moment = require('moment'),
    Word = require('../models/word'),
    Process = require('../models//process');
var lexicalAnalyser = function (text) {
    var frequencies = frequency(text),
        words = [];
    // Prcess Setup
    var process = new Process({
        name: 'lexicalAnalyser',
        started: moment().toISOString()
    });
    Process.update({name: process.name}, process.toObject(), {upsert: true}, function(err) {
        if(err) { throw err; }
    });
    for(var word in frequencies) {
        var wordIndex = words.indexOf(word);
        if(wordIndex > -1) {
            words[wordIndex].count += frequencies[word];
        } else {
            var newWord = new Word({
                word: word,
                count: frequencies[word]
            });
            words.push(newWord);
        }
    }
    if(words.length > 0) {
        saveAll(words);
        function saveAll(words) {
            var wordToSave = words.pop();
            Word.update({word: wordToSave.word}, wordToSave.toObject(), {upsert: true}, function(err) {
                if(err) { throw err; }
                if(words.length > 0) { saveAll(words); }
            });
        }
    }
    Process.incrementRuns('lexicalAnalyser', function(err) {
        if(err) { throw err; }
    });
};
module.exports = lexicalAnalyser;