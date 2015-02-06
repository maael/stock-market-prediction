var controllers = require('./controllers');
module.exports = function(app) {
	app.get('/', function(req, res){
		controllers.index(req, res);
	});
	app.get('/dashboard', function(req, res) {
		controllers.dashboard(req, res);
	});
	app.get('/user/login', function(req, res) {
		controllers.auth.login(req, res);
	});
	app.get('/user/logout', function(req, res) {
		controllers.auth.logout(req, res);
	});
	app.get('/user/:id', function(req, res) {
		controllers.user.get(req, res);
	});
	app.get('/user/:id/edit', function(req, res) {
		controllers.user.edit(req, res);
	});
	app.put('/user/:id/edit', function(req, res) {
		controllers.user.update(req, res);
	});
	app.get('/companies', function(req, res) {
		controllers.companies.list(req, res);
	});
	app.get('/companies/:company', function(req, res) {
		controllers.companies.view(req, res);
	});
	app.put('/companies/:company/add', function(req, res) {
		controllers.companies.add(req, res);
	});
	app.get('/companies/:company/remove', function(req, res) {
		controllers.companies.confirmRemove(req, res);
	});
	app.put('/companies/:company/remove', function(req, res) {
		controllers.companies.remove(req, res);
	});
	app.get('/feed', function(req, res) {
		controllers.feed.list(req, res);
	});
	app.get('/feed/:activity', function(req, res) {
		controllers.feed.view(req, res);
	});
	app.get('/news', function(req, res) {
		controllers.news.list(req, res);
	});
	app.get('/news/:company', function(req, res) {
		controllers.news.view(req, res);
	});
}