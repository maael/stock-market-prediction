var http = require('http'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    dbConfig = require('../config/db'),
    MarketData = require('./models/marketData'),
    Company = require('./models/company'),
    Following = require('./models/following'),
    request = require('request');


var api = (function() {
  /*
  * User APIs
  */
  function user() {
    function company() {
      function put(req, res) {
        var download = function(host, path, symbol, cb) {
          var options = {
              host: host,
              port: 80,
              path: path,
              method: 'GET',
              agent: false
          },  callback = function(res) {
              var data = '';
              res.on('data', function(d) {
                  data += d;
              });
              res.on('end', function() {
                  cb(null, data, symbol);
              });
          }
          var request = http.get(options, callback);
          request.on('error', function(err) {
              if(err) { throw err; }
          });
          request.end();
        }
        var currentDate = {
          day: moment().format('D'), 
          month: moment().format('MM'), 
          year: moment().format('YYYY')
        },
        yearAgoDate = {
            day: moment().subtract(1, 'years').format('D'), 
            month: moment().subtract(1, 'years').format('MM'), 
            year: moment().subtract(1, 'years').format('YYYY')
        },
        host = 'real-chart.finance.yahoo.com',
        path = '/table.csv?s=' + req.body.symbol;
        path += '&d=' + currentDate.month + '&e=' + currentDate.day + '&f=' + currentDate.year;
        path += '&g=d';
        path += '&a=' + yearAgoDate.month + '&b=' + yearAgoDate.day + '&c=' + yearAgoDate.year;
        path += '&ignore=.csv';
        var user = req.user,
            company = new Company();
        company.name = req.body.name;
        company.symbol = req.body.symbol;
        company.market = req.body.market;
        Company.findOne({'symbol': company.symbol}, function(err, foundCompany) {
          if(err) { res.send(err); }
          if(foundCompany) {
            var follow = new Following();
            follow.user = req.user._id;
            follow.company = foundCompany._id;
            follow.save(function(err) {
              if(err) res.send(err);
              res.json({message: 'success'});
            });
          } else {
            download(host, path, req.body.symbol, function(err, data, symbol) {
              var historicalData = [];
              var lines = data.split('\n'), parts;
              lines.pop();
              lines.shift();
              if(!err) {
                for(var i = (lines.length - 1); i >= 0; i--) {
                  var parts = lines[i].split(',');
                  if(parts.length === 7) {
                    var marketData = new MarketData();
                    marketData.date = parts[0];
                    marketData.open = parts[1];
                    marketData.high = parts[2];
                    marketData.low = parts[3];
                    marketData.close = parts[4];
                    marketData.volume = parts[5];
                    marketData.adjClose = parts[6];
                    historicalData.push(marketData);
                  }
                }
              } else  {
                  //doesn't exist or error
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
              getQuote(company, function(company, quote) {
                company.quotes = [];      
                company.quotes.push(quote);
                company.historicalData = historicalData;
                company.save(function(err, saved) {
                  if(err) { res.send(err); }
                  var follow = new Following();
                  follow.user = req.user._id;
                  follow.company = saved._id;
                  follow.save(function(err) {
                    if(err) res.send(err);
                    res.json({message: 'success'});
                  });
                }); 
              });
            });  
          }
        });
      }
      return {
        put: put
      };
    }
    return {
      company: company
    };
  }
  /*
  * Company APIs
  */
  function company() {
    function put(req, res) {
      var company = new Company();
      company.name = req.body.name;
      company.symbol = req.body.symbol;
      company.market = req.body.market;
      company.historicalData = [];
      company.save(function(err) {
        if(err) res.send(err);
        res.json({message: 'success'});
      });
    }
    function get(req, res) {
      Company.find({ 'symbol' : req.query.symbol }, function(err, foundCompany) {
        if(err) { throw err; }
        if(foundCompany) {
          res.json(foundCompany);
        } else {
          res.json({error: 'no company exists'});
        }
      });
    }
    return {
      get: get,
      put: put
    };
  };
  return {
    user: user,
    company: company
  };
})();

module.exports = api;