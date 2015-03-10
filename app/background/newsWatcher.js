var parser = require('parse-rss'),
    watchFeeds = require('./newsFeeds'),
    moment = require('moment');
var properties = [];
(function() {
    var interval = 60000;
    run();
    setInterval(run, interval);
    function run() {
        console.log('\nRun at [' + moment().format('HH:mm') + '] | Refreshing at [' + moment().add(1, 'minutes').format('HH:mm') + ']\n');
        var shortenedRSS = [];
        for(var i = 0; i < watchFeeds.length; i++) (function(index) {
            if(watchFeeds[index].enabled) {     
                parser(watchFeeds[index].feed, function(err, rss) {
                    if(err || !rss) {
                        console.log(watchFeeds[index].name + ' Failed | ' + err);
                    } else {
                        console.log('[' + index + '] ' + watchFeeds[index].name + ' | ' + rss.length + ' articles \nLatest: ' + rss[0].title + ' @ ' + rss[0].date + '\n');
                        for(var i in rss[0]) {
                            if(properties.indexOf(i) === -1) {
                                properties.push(i);
                            }
                        }
                        //console.log(rss[0]);
                    }
                });
            }
        })(i);
    }
})();