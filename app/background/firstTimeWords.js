var lexicalAnalyser = require('./lexicalAnalyser'),
    Word = require('../models/word'),
    News = require('../models/news');
var firstTimeWords = function(callback) {
    News.find().stream()
    .on('data', function(article) {
        lexicalAnalyser(article.title);
    })
    .on('close', function() {
        if(typeof(callback) === 'function') { 
            callback(); 
        }
    })
    .on('error', function(err) {
        throw err;
    });
};

module.exports = firstTimeWords;