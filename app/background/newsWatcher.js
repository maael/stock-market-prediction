var parser = require('parse-rss'),
    watchFeeds = require('./newsFeeds'),
    moment = require('moment'),
    dbConfig = require('../../config/db'),
    mongoose = require('mongoose'),
    News = require('../models/news'),
    NewsArticle = require('../models/newsArticle'),
    Process = require('../models/process');
var properties = [];
(function() {
    var count = 0,
        interval = 1800000; // 30 minutes
    mongoose.connect(dbConfig.url);
    // Prcess Setup
    var process = new Process({
        name: 'newsWatcher',
        started: moment().toISOString()
    });
    // Start process running
    run();
    setInterval(run, interval);
    function run() {
        count++;
        process.lastRun = moment().toISOString();
        process.runs = count;
        Process.update({name: process.name}, process.toObject(), {upsert: true}, function(err) {
            if(err) { throw err; }
        });
        for(var i = 0; i < watchFeeds.length; i++) (function(index) {
            if(watchFeeds[index].enabled) {
                var feed = {};
                feed.name = watchFeeds[index].name;
                feed.feed = watchFeeds[index].feed;
                feed.feedType = watchFeeds[index].type;   
                parser(watchFeeds[index].feed, function(err, rss) {
                    if(err || !rss) {
                        console.log(watchFeeds[index].name + ' Failed | ' + err);
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
                            News.update({'date': newsDay}, { $addToSet: {articles: [article]} }, { upsert: true }, function(err) {
                                if(err && (err.code !== 11000)) { throw err; }
                                if(!err) {
                                    lexicalAnalyser(article.title);
                                    process.lastUpdated = moment().toISOString();                    
                                    Process.update({name: process.name}, process.toObject(), {upsert: true}, function(err) {
                                        if(err) { throw err; }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        })(i);
    }
})();