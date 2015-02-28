var Company = require('./models/company'),
    Following = require('./models/following');
var api = (function() {
  /*
  * User APIs
  */
  function user() {
    function company() {
      function put(req, res) {
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
      company.save(function(err) {
        if(err) res.send(err);
        res.json({message: 'success'});
      });
    }
    return {
      put: put
    };
  };
  return {
    user: user,
    company: company
  };
})();

module.exports = api;