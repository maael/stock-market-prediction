var controllers = (function() {
  /*
  * Index Controllers
  */
  function index(req, res) {
    res.render('index');
  };

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
  };

  /*
  * Companies Controllers
  */
  function companies() {
      function list(req, res) {
        res.render('companies/list');
      };
      function view(req, res) {
        res.render('companies/detail');
      };
      function add(req, res) {
        res.render('companies/remove');
      };
      function remove(req, res) {
        res.render('companies/remove');
      };
      function addCompany(req, res) {

      };
      function removeCompany(req, res) {

      };
      return {
        list: list,
        view: view,
        remove: remove,
        addCompany: addCompany,
        removeCompany: removeCompany
      };
    };

  /*
  * Authentication Controllers
  */
  function auth() {
  };

  /*
  * User Controllers
  */
  function user() {
    function details(req, res) {
      res.render('user/details');
    };
    function login(req, res) {
      res.render('user/login');
    };
    function logout(req, res) {
      res.render('user/logout');
    };
    function register(req, res) {
      res.render('user/register');
    };
    return {
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
  };

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
  };

  /*
  * Expose Controllers
  */
  return {
    index: index,
    dashboard: dashboard,
    companies: companies,
    auth: auth,
    user: user,
    feed: feed,
    news: news
  }
})();

module.exports = controllers;