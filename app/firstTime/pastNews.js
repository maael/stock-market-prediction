var News = require('../models/news'),
    tokenizer = require('../background/tokenizer'),
    DayTokens = require('../models/dayTokens'),
    moment = require('moment'),
    lexicalAnalyser = require('../background/lexicalAnalyser');
var getNewsTrainingExamples = function(callback) {
    var operationsDone = 0,
        operationsBeforeClose = 0,
        articleTitles = '';
    function closeCheck() {
        if(operationsDone === operationsBeforeClose) {
            lexicalAnalyser(articleTitles, function() {
                callback();
            })
        } else {
            setTimeout(function() { closeCheck() }, 1000);
        }
    }
    function stripText(text) {
        return text.replace(/<[^>]+>|[!.?,;:'"-]/g,'').replace(/\r?\n|\r|\s+|\t/g, ' ').trim();
    }
    function getDates(callback) {
        var dates = [];
        News.find({}, {date: 1}).sort({date: 1}).stream()
        .on('data', function(day) {
            dates.push(day.date);
        })
        .on('close', function() {
            callback(dates);
        })
        .on('error', function(err) {
            console.log(err);
        });
    }
    function getArticles() {
        getDates(function(dates) {
                operationsBeforeClose = dates.length;
            for(var i = 0; i < dates.length; i++) (function(i) {
                var tokens = [];
                News.findOne({date: dates[i]}).stream()
                .on('data', function(day) {
                    var articles = day.articles;
                    for(var j = 0; j < articles.length; j++) {
                        articleTitles += articles[j]._doc['0'].title + ' ';
                        var words = stripText(articles[j]._doc['0'].title.toLowerCase()).split(' ');
                        for(var k = 0; k < words.length; k++) {
                            tokens.push(tokenizer(words[k]));
                        }
                    }
                    DayTokens.update({'date': moment(dates[i]).startOf('day').toISOString()}, { $pushAll : {tokens: tokens}}, { upsert: true }, function(err) {
                        if(err) { throw err; }
                        operationsDone += 1;
                    });
                })
                .on('close', function() {
                    closeCheck();
                })
                .on('error', function(err) {
                    if(err) { throw err; }
                });
            })(i);
        })
    }
    getArticles();
}

module.exports = getNewsTrainingExamples;