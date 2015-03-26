var frequency = require('word-frequency'),
    moment = require('moment'),
    Word = require('../models/word'),
    Process = require('../models//process'),
    tokenizer = require('./tokenizer');
var lexicalAnalyser = function (text, callback) {
    var frequencies = frequency(text),
        words = [];
    console.log('Start Lexical Analyse');
    // Prcess Setup
    var process = new Process({
        name: 'lexicalAnalyser',
        started: moment().toISOString()
    });
    Process.update({name: process.name}, process.toObject(), {upsert: true}, function(err) {
        if(err) { throw err; }
    });
    Word.find(function(err, words) {
        function findWord(words, word) {
            var index = -1;
            for(var i = 0; i < words.length; i++) {
                if(words[i].word === word) {
                    index = i;
                    break;
                }
            }
            return index;
        }
        for(var word in frequencies) {
            var wordIndex = findWord(words, word);
            if(wordIndex > -1) {
                words[wordIndex].count += frequencies[word];
            } else {
                var newWord = new Word({
                    word: word,
                    count: frequencies[word],
                    token: tokenizer(word)
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
                    else {
                        if(typeof(callback) === 'function') {
                            console.log('Finished Lexical Analyse');
                            callback();
                        }
                    }
                });
            }
        } else {    
            if(typeof(callback) === 'function') {
                console.log('Finished Lexical Analyse');
                callback();
            }
        }
    });
    Process.incrementRuns('lexicalAnalyser', function(err) {
        if(err) { throw err; }
    });
};
module.exports = lexicalAnalyser;