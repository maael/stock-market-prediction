var User = require('./models/user'),
    Company = require('./models/company'),
    Following = require('./models/following'),
    News = require('./models/news'),
    ObjectId = require('mongoose').Types.ObjectId,
    moment = require('moment'),
    frequency = require('word-frequency');
/**
 * Returns an object of controller objects with functions
 * @module controllers
 * @namespace
 * @returns {object}
 */
var controllers = (function() {
  /**
   * Index Controllers
   * @param {object} req - request object provided by Express
   * @param {object} res - response object provided by Express
   */
  function index(req, res) {
    res.render('index');
  }

  /**
   * Dashboard Controllers
   * @param {object} req - request object provided by Express
   * @param {object} res - response object provided by Express
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

  /**
   * Companies Controllers
   * @namespace
   * @returns {object}
   */
  function companies() {
      /**
       * Shows Companies page, with list of user followed companies
       * @param {object} req - request object provided by Express
       * @param {object} res - response object provided by Express
       */
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
      /**
       * Used to get a single companies information for use by other pages
       * @param {object} req - request object provided by Express
       * @param {object} res - response object provided by Express
       * @see fillCompany
       */
      function get(req, res, next, symbol) {
        Company.findOne({ 'symbol' : symbol }, function(err, company) {
          if(err) { 
            throw err; 
          } else if(company) {
            req.company = company;
            next();
          } else {
            next();
          }
        })
      }
      /**
       * Shows a single company's details page
       * @param {object} req - request object provided by Express
       * @param {object} res - response object provided by Express
       */
      function view(req, res) {
        res.render('companies/detail', {
          user: req.user,
          company: req.company
        });
      }
      function remove(req, res) {
        res.render('companies/remove');
      }
      return {
        list: list,
        get: get,
        view: view,
        remove: remove
      };
    }

  /**
   * Unlinking Authentication Controllers
   * @namespace
   * @returns {object}
   */
  function unlink() {
    /**
     * Local account unlinking
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
    function local(req, res) {
      var user = req.user;
      user.local.email = undefined;
      user.local.password = undefined;
      user.save(function(err) {
        res.redirect('/user');
      });      
    }
    /**
     * Facebook account unlinking
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
    function facebook(req, res) {
      var user = req.user;
      user.facebook.token = undefined;
      user.save(function(err) {
        res.redirect('/user');
      });  
    }
    /**
     * Twitter account unlinking
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
    function twitter(req, res) {
      var user = req.user;
      user.twitter.token = undefined;
      user.save(function(err) {
        res.redirect('/user');
      });  
    }
    /**
     * Google account unlinking
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
    function google(req, res) {
      var user = req.user;
      user.google.token = undefined;
      user.save(function(err) {
        res.redirect('/user');
      });  
    }
    /**
     * LinkedIn account unlinking
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
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

  /**
   * User Controllers
   * @namespace
   * @returns {object}
   */
  function user() {
    /**
     * Connect local account
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
    function connect(req, res) {
      res.render('user/connect-local');
    }
    /**
     * Show account page, with list of linked accounts
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
    function details(req, res) {
      res.render('user/details', {
        user: req.user
      });
    }
    /**
     * Show account login page
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
    function login(req, res) {
      res.render('user/login');
    }
    /**
     * Show account logout page
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
    function logout(req, res) {
      req.logout();
      res.redirect('/');
    }
    /**
     * Show account registration page
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
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

  /**
   * Feed Controllers
   * @namespace
   * @returns {object}
   */
  function feed() {
    function list(req, res) {
      res.render('feed/list', {
        user: req.user
      });
    };
    function view(req, res) {
      res.render('feed/detail');
    };
    return {
      list: list,
      view: view
    };
  }

  /**
   * News Controllers
   * @namespace
   * @returns {object}
   */
  function news() {
    /**
     * Shows News page, listing recent news items
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     */
    function list(req, res) {
      res.render('news/list', {
        user: req.user
      });
    };
    return {
      list: list
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
    news: news
  }
})();

module.exports = controllers;