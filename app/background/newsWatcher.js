var parser = require('parse-rss'),
    watchFeeds = require('./newsFeeds'),
    moment = require('moment'),
    dbConfig = require('../../config/db'),
    mongoose = require('mongoose'),
    News = require('../models/news'),
    NewsArticle = require('../models/newsArticle'),
    Process = require('../models/process'),
    lexicalAnalyser = require('./lexicalAnalyser'),
    tokenizer = require('./tokenizer'),
    DayTokens = require('../models/dayTokens');
var properties = [];
(function() {
    var count = 0,
        interval = 1800000; // 30 minutes
    // Prcess Setup
    var process = new Process({
        name: 'newsWatcher',
        started: moment().toISOString()
    });
    // Start process running
    run();
    setInterval(run, interval);
    function run() {
        var operationsDone = 0,
            operationsBeforeClose = 0,
            articlesText = '';
        function closeCheck() {
            console.log(moment().format('YYYY-MM-DD HH:mm:ss').toString() + ': ' + 'Checking to close newsWatcher, ' + operationsDone + '/' + operationsBeforeClose + 'operations done');
            if(operationsDone === operationsBeforeClose) {
                if(articlesText.length > 0) {
                    articlesText = articlesText.substr(0, articlesText.length-1);
                    lexicalAnalyser(articlesText, function() {
                        mongoose.connection.close();
                    });
                } else {
                    mongoose.connection.close();
                }
            } else {
                setTimeout(function() { closeCheck() }, 1000);
            }
        }
        function saveTokens(date, text, callback) {
            var tokens = [];
            function stripText(text) {
                return text.replace(/<[^>]+>|[!.?,;:'"-]/g,'').replace(/\r?\n|\r|\s+|\t/g, ' ').trim();
            }
            var words = stripText(text.toLowerCase()).split(' ');
            for(var k = 0; k < words.length; k++) {
                tokens.push(tokenizer(words[k]));
            }
            DayTokens.update({'date': date}, { $pushAll: {tokens: tokens}}, { upsert: true }, function(err) {
                if(err) { throw err; }
                callback();
            });
        }
        if(mongoose.connection.readyState === 0) {
            mongoose.connect(dbConfig.url);
        }
        count++;
        for(var i = 0; i < watchFeeds.length; i++) (function(index) {
            if(watchFeeds[index].enabled) {
                var feed = watchFeeds[index];
                parser(watchFeeds[index].feed, function(ParserErr, rss) {
                    var getKeys = function(obj){
                       var keys = [];
                       for(var key in obj){
                          keys.push(key);
                       }
                       return keys;
                    }
                    if((ParserErr && (ParserErr.code !== 11000)) || !rss) {
                        console.log(moment().format('YYYY-MM-DD HH:mm:ss').toString() + ': ' + watchFeeds[index].name + ' Failed | ' + ParserErr);
                    } else {
                        for(var j = 0; j < rss.length; j++) {
                            var article = new NewsArticle(),
                                articleDate = rss[j].date || rss[j].pubdate || rss[j].pubDate;
                                newsDay = moment(rss[j].date).startOf('day').toISOString().valueOf();
                            article.guid = rss[j].guid;
                            article.title = rss[j].title;
                            article.description = rss[j].description || rss[j].summary;
                            article.description = article.description.replace('Continue reading...', '');
                            article.description = article.description.replace('<br>', '');
                            article.date = moment(articleDate).toISOString();
                            article.link = rss[j].link;
                            article.author = rss[j].author || 'Unknown';
                            article.categories = rss[j].categories;
                            article.feed = feed;
                            operationsBeforeClose++;
                            News.update({'date': newsDay}, { $addToSet: {articles: [article]} }, { upsert: true }, function(err) {
                                if(err && (err.code !== 11000)) { throw err; }
                                if(err && err.code === 11000) {
                                    operationsBeforeClose--;
                                }
                                if(!err) {
                                    articlesText += article.title + ' ';
                                    saveTokens(article.date, article.title, function() {
                                        operationsDone++;
                                    });
                                    process.lastUpdated = moment().toISOString();
                                }
                            });
                        }
                    }
                });
            }
        })(i);
        process.lastRun = moment().toISOString();
        process.runs = count;
        Process.update({name: process.name}, process.toObject(), {upsert: true}, function(err) {
            if(err) { throw err; }
        });
    }
})();