var server = require('./server'),
    dbConfig = require('./config/db'),
    app = server.getApp(dbConfig.url);

var runningServer = app.listen(server.port, function () {
  console.log('Listening at http://%s:%s', runningServer.address().address, runningServer.address().port);
}); 