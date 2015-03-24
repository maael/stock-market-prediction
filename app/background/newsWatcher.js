var parser = require('parse-rss'),
    watchFeeds = require('./newsFeeds'),
    moment = require('moment'),
    dbConfig = require('../../config/db'),
    mongoose = require('mongoose'),
    News = require('../models/news'),
    NewsArticle = require('../models/newsArticle'),
    Process = require('../models/process'),
    lexicalAnalyser = require('./lexicalAnalyser');
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
            articles
        function closeCheck() {
            if(operationsDone === operationsBeforeClose) {
                mongoose.connection.close();
            } else {
                setTimeout(function() { closeCheck() }, 1000);
            }
        }
        mongoose.connect(dbConfig.url);
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
                    if(typeof(rss[0].meta['rss:pubdate']) !== 'undefined') {
                        console.log(rss[0].meta['rss:pubdate']['#']);   
                    } else if (typeof(rss[0].meta['rss:lastbuilddate']) !== 'undefined') {
                        console.log(rss[0].meta['rss:lastbuilddate']['#']);  
                    } else {
                        console.log(rss[0].meta);  
                    }
                    if((ParserErr && (ParserErr.code !== 11000)) || !rss) {
                        console.log(moment().format('YYYY-MM-DD HH:mm:ss').toString() + ': ' + watchFeeds[index].name + ' Failed | ' + ParserErr);
                    } else {
                        for(var j = 0; j < rss.length; j++) {
                            var article = new NewsArticle(),
                                articleDate = rss[j].date || rss[j].pubdate || rss[j].pubDate;
                                newsDay = moment(rss[j].date).set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).toISOString().valueOf();
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
                            //News.update({'date': newsDay}, { $addToSet: {articles: [article]} }, { upsert: true }, function(err) {
                            //    if(err && (err.code !== 11000)) { throw err; }
                            //    if(!err) {
                            //        lexicalAnalyser(article.title);
                            //        process.lastUpdated = moment().toISOString();                    
                            //        Process.update({name: process.name}, process.toObject(), {upsert: true}, function(err) {
                            //            if(err) { throw err; }
                            //        });
                            //    }
                            //});
                        }
                    }
                });
            }
        })(i);
        process.lastRun = moment().toISOString();
        process.runs = count;
        //Process.update({name: process.name}, process.toObject(), {upsert: true}, function(err) {
            //if(err) { throw err; }
        //});
    }
})();