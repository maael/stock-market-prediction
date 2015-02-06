function index (req, res) {
	res.render('index');
};

function dashboard (req, res) {
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
  res.render('dashboard', {
    companies: companies
  });
};

function companies (req, res) {

};

function auth (req, res) {

};

function feed (req, res) {

};

function news (req, res) {

};

module.exports = {
	index: index,
	dashboard: dashboard,
	companies: companies,
	auth: auth,
	feed: feed,
	news: news
}