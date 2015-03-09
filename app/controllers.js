var User = require('./models/user'),
    Company = require('./models/company'),
    Following = require('./models/following'),
    ObjectId = require('mongoose').Types.ObjectId;
var controllers = (function() {
  /*
  * Index Controllers
  */
  function index(req, res) {
    res.render('index');
  }

  /*
  * Dashboard Controllers
  */
  function dashboard(req, res) {
    var companies = [
      {
        name: 'Nomura',
        link: '/nomura'
      },
      {
        name: 'Credit Suisse',
        link: '/creditsuisse'
      }
    ];
    res.render('dashboard/view', {
      companies: companies
    });
  }

  /*
  * Companies Controllers
  */
  function companies() {
      function list(req, res) {
        Following.find({ 'user' : req.user.id }, function(err, following) {
          var followedCompanies = [];
          for(var i = 0; i < following.length; i++) {
            followedCompanies.push(following[i].company);
          }
          Company.find({ '_id' : { $in: followedCompanies }}, function(err, companies) {
            if(err) { throw err; }
            res.render('companies/list', {
              user: req.user,
              companies: companies
            });
          });
        });
      }
      function get(req, res, next, symbol) {
        Company.findOne({ 'symbol' : symbol }, function(err, company) {
          if(err) { 
            throw err; 
          } else if(company) {
            req.company = company;
            next();
          } else {
            next(new Error('Failed to load company'));
          }
        })
      }
      function view(req, res) {
        res.render('companies/detail', {
          user: req.user,
          company: req.company
        });
      }
      function add(req, res) {
        res.render('companies/remove');
      }
      function remove(req, res) {
        res.render('companies/remove');
      }
      function addCompany(req, res) {

      }
      function removeCompany(req, res) {

      }
      return {
        list: list,
        get: get,
        view: view,
        remove: remove,
        addCompany: addCompany,
        removeCompany: removeCompany
      };
    }

  /*
  * Unlinking Authentication Controllers
  */
  function unlink() {
    function local(req, res) {
      var user = req.user;
      user.local.email = undefined;
      user.local.password = undefined;
      user.save(function(err) {
        res.redirect('/user');
      });      
    }
    function facebook(req, res) {
      var user = req.user;
      user.facebook.token = undefined;
      user.save(function(err) {
        res.redirect('/user');
      });  
    }
    function twitter(req, res) {
      var user = req.user;
      user.twitter.token = undefined;
      user.save(function(err) {
        res.redirect('/user');
      });  
    }
    function google(req, res) {
      var user = req.user;
      user.google.token = undefined;
      user.save(function(err) {
        res.redirect('/user');
      });  
    }
    function linkedin(req, res) {
      var user = req.user;
      user.linkedin.token = undefined;
      user.save(function(err) {
        res.redirect('/user');
      });  
    }
    return {
      local: local,
      facebook: facebook,
      twitter: twitter,
      google: google,
      linkedin: linkedin
    };
  };

  /*
  * User Controllers
  */
  function user() {
    function connect(req, res) {
      res.render('user/connect-local');
    }
    function details(req, res) {
      res.render('user/details', {
        user: req.user
      });
    }
    function login(req, res) {
      res.render('user/login');
    }
    function logout(req, res) {
      req.logout();
      res.redirect('/');
    }
    function register(req, res) {      
      res.render('user/register');
    }
    return {
      connect: connect,
      details: details,
      login: login,
      logout: logout,
      register: register
    };
  }

  /*
  * Feed Controllers
  */
  function feed() {
    function list(req, res) {
      res.render('feed/list');
    };
    function view(req, res) {
      res.render('feed/detail');
    };
    return {
      list: list,
      view: view
    };
  }

  /*
  * News Controllers
  */
  function news() {
    function list(req, res) {

    };
    function view(req, res) {

    };
    return {
      list: list,
      view: view
    };
  }
  /*
  * Market Controllers
  */
  function market() {
    function list(req, res) {

    };
    function view(req, res) {

    };
    return {
      list: list,
      view: view
    };
  }

  /*
  * Expose Controllers
  */
  return {
    index: index,
    dashboard: dashboard,
    companies: companies,
    unlink: unlink,
    user: user,
    feed: feed,
    news: news,
    market: market
  }
})();

module.exports = controllers;