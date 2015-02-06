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

module.exports = {
	index: index,
	dashboard: dashboard
}