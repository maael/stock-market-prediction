var controllers = require('./controllers');
module.exports = function(app) {
	app.get('/', function(req, res){
		controllers.index(req, res);
	});
	app.get('/dashboard', function(req, res){
		controllers.dashboard(req, res);
	});
}