var express = require('express'),
    pub = __dirname + '/public',
    app = express(),
    port = process.env.PORT || 3000;
app.use(express.static(pub));
app.set('views',__dirname + '/views');
app.set('view engine','jade');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/dashboard', function (req, res) {
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
});

var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});