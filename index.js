var express = require('express'),
    pub = __dirname + '/public',
    app = express(),
    port = process.env.PORT || 3000,
    routes = require('./routes');
app.use(express.static(pub));
app.set('views',__dirname + '/views');
app.set('view engine','jade');

routes(app);

var server = app.listen(port, function () {
  var host = server.address().address,
      port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});