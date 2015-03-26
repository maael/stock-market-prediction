var mongoose = require('mongoose'),
    dbConfig = require('../../config/db'),
    firstTimeNews = require('./pastNews'),
    Word = require('../models/word'),
    DayTokens = require('../models/dayTokens');

var firstTimeSetup = function(callback) {
    function setUp() {
        firstTimeNews(function() {
            mongoose.connection.close();
            callback();
        });
    }
    if(mongoose.connection.readyState === 0) {
        mongoose.connect(dbConfig.url);
    }
    Word.count(function(err, wordCount) {
        if(wordCount === 0) {
            setUp();
        } else {
            DayTokens.count(function(tokenErr, daysCount) {
                if(daysCount === 0) {
                    setUp();
                }
                else {
                    mongoose.connection.close();
                    callback();
                }
            });
        }
    });
}

module.exports = firstTimeSetup;