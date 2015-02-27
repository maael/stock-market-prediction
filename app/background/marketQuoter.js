var request = require('request'),
    mongoose = require('mongoose'),
    Company = require('../models/company.js'),
    dbConfig = require('../../config/db.js'),
(function() {
    mongoose.connect(dbConfig.url);
    var count = 0;
    var interval = 1800000; // 30 minutes
    run();
    setInterval(run, interval);
    function run() {
        count++;
        Company.find({}, function(err, companies) {
            if(err) { throw err; }
            for(var i = 0; i < companies.length; i++) {
                var company = companies[i];
                if(typeof(company.quotes) !== 'undefined') {
                    getQuote(company, function(company, quote) {
                        company.quotes.push(quote);
                        if(company.quotes.length > 50) {
                            company.quotes.splice(-(company.quotes.length - 50), (company.quotes.length - 50));
                        }
                        console.log(company.quotes.length);
                        company.save(function(err, company) {
                            if(err) { throw err; }
                        }); 
                    });
                }                 
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