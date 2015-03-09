var http = require('http'),
    fs = require('fs'),
    moment = require('moment');

var historicalMarketData = (function(symbol) {
    var download = function(url, dest, cb) {
        var file = fs.createWriteStream(dest),
        request = http.get(url, function(res) {
            res.pipe(file);
            file.on('finish', function() {
                file.close(cb);
            });
        }).on('error', function(err) {
            fs.unlink(dest);
            if(cb) cb(err.message);
        });
    }
    var currentDate = {
        day: moment().format('D'), 
        month: moment().format('MM'), 
        year: moment().format('YYYY')
    },
    yearAgoDate = {
        day: moment().subtract(1, 'years').format('D'), 
        month: moment().subtract(1, 'years').format('MM'), 
        ear: moment().subtract(1, 'years').format('YYYY')
    },
    url = 'http://real-chart.finance.yahoo.com/table.csv?s=' + symbol;
    url += '&d=' + currentDate.month + '&e=' + currentDate.day + '&f=' + currentDate.year;
    url += '&g=d';
    url += '&a=' + yearAgoDate.month + '&b=' + yearAgoDate.day + '&c=' + yearAgoDate.year;
    url += '&ignore=.csv';
    dest = '../data/market/historical/' + symbol + '.csv';
    download(url, dest, function(err) {
        if(!err) {
            //we're safe to continue
        } else  {
            //doesn't exist or error
        }
    });
});
historicalMarketData('YHOO');
