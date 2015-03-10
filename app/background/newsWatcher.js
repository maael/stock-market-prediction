var parser = require('parse-rss'),
    watchFeeds = require('./newsFeeds'),
    moment = require('moment'),
    dbConfig = require('../../config/db'),
    mongoose = require('mongoose'),
    NewsArticle = require('../models/newsArticle');
var properties = [];
(function() {
    var interval = 60000; // 1 minute
    mongoose.connect(dbConfig.url);
    run();
    setInterval(run, interval);
    function run() {
        console.log('\nRun newsWatcher at [' + moment().format('HH:mm') + '] | Refreshing at [' + moment().add(1, 'minutes').format('HH:mm') + ']\n');
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
                        console.log('Found ' + rss.length + ' Articles for ' + watchFeeds[index].name);
                        for(var j = 0; j < rss.length; j++) {
                            var article = new NewsArticle(),
                                articleDate = rss[j].date || rss[j].pubdate || rss[j].pubDate;
                            article.guid = rss[j].guid;
                            article.title = rss[j].title;
                            article.description = rss[j].description || rss[j].summary;
                            article.date = moment(articleDate).toISOString();
                            article.link = rss[j].link;
                            article.author = rss[j].author || 'Unknown';
                            article.categories = rss[j].categories;
                            article.feed = feed;
                            article.save(function(err) {
                                if(err) { 
                                   if(err.code !== 11000) {
                                        throw err;
                                   }
                                }
                            });
                        }
                    }
                });
            }
        })(i);
    }
})();