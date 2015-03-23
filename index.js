var server = require('./server'),
    dbConfig = require('./config/db'),
    moment = require('moment'),
    app = server.getApp(dbConfig.url);

var runningServer = app.listen(server.port, function () {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss').toString() + ': ' + 'Listening at http://%s:%s', runningServer.address().address, runningServer.address().port);
}); 