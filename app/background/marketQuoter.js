var request = require('request'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Company = require('../models/company'),
    Process = require('../models/process'),
    dbConfig = require('../../config/db');

(function() {
    var count = 0,
        started = moment().toISOString(),
        interval = 1800000; // 30 minutes
    mongoose.connect(dbConfig.url);
    run();
    setInterval(run, interval);
    function run() {
        function quoteExists(quote, quotes) {
            for(var i = 0; i < quotes.length; i++) {
                if(JSON.stringify(quotes[i]) === JSON.stringify(quote)) { return true; }
            }
            return false;
        }
        count++;
        var process = new Process({
            name: 'marketQuoter',
            started: started,
            lastRun: moment().toISOString(),
            runs: count
        });
        Process.update({name: process.name}, process.toObject(), {upsert: true}, function(err) {
            if(err) { throw err; }
        });
        Company.find({}, function(err, companies) {
            if(err) { throw err; }
            for(var i = 0; i < companies.length; i++) {
                var company = companies[i];
                getQuote(company, function(company, quote) {
                    if(!quoteExists(quote, company.quotes)) {
                        company.quotes.push(quote);
                        if(company.quotes.length > 50) {
                            company.quotes.splice(-(company.quotes.length - 50), (company.quotes.length - 50));
                        }
                        company.save(function(err, company) {
                            if(err) { throw err; }
                            process.lastUpdated = moment().toISOString();                    
                            Process.update({name: process.name}, process.toObject(), {upsert: true}, function(err) {
                                if(err) { throw err; }
                            });
                        });
                    }
                });                
            }
        });
    }
    function getQuote(company, quoteCallback) {
        var requestURL = 'http://dev.markitondemand.com/Api/v2/Quote/json?symbol=' + company.symbol.toString();
        request(requestURL, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                var json = JSON.parse(body);
                if(typeof(quoteCallback) === 'function') { quoteCallback(company, json); }
            }
        });
    }
})();