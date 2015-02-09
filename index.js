var express = require('express'),
    pub = __dirname + '/public',
    app = express(),
    port = process.env.PORT || 3000,
    routes = require('./app/routes'),
    db = require('./config/db');

/* Configure app */
app.use(express.static(pub));
app.set('views',__dirname + '/views');
app.set('view engine','jade');

/* Perform app routings */
routes(app);

/* Initialise app */
var server = app.listen(port, function () {
  var host = server.address().address,
      port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
}); 