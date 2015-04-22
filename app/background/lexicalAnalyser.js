var frequency = require('word-frequency'),
    moment = require('moment'),
    Word = require('../models/word'),
    Process = require('../models//process'),
    tokenizer = require('./tokenizer');
/**
 * The Lexical Analyser Process
 * @module lexicalAnalyser
 * @param {string} text - the text to analyse
 * @param {function} lexicalCallback - the function to call when the analysis is complete
 */
var lexicalAnalyser = function (text, lexicalCallback) {
    /** @private */
    var frequencies = frequency(text),
        words = [];
    // Prcess Setup
    /** @private */
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
                delete newWord._id;
                words.push(newWord);
            }
        }
        if(words.length > 0) {
            saveAll(words);
            function saveAll(words) {
                var wordToSave = words.pop(),
                    wordObject = wordToSave.toObject();
                delete wordObject._id;
                Word.update({word: wordToSave.word}, wordObject, {upsert: true}, function(err) {
                    if(err) { throw err; }
                    if(words.length > 0) { saveAll(words); }
                    else {
                        if(typeof(lexicalCallback) === 'function') {
                            lexicalCallback();
                        }
                    }
                });
            }
        } else {    
            if(typeof(lexicalCallback) === 'function') {
                lexicalCallback();
            }
        }
    });
    Process.incrementRuns('lexicalAnalyser', function(err) {
        if(err) { throw err; }
    });
};
module.exports = lexicalAnalyser;