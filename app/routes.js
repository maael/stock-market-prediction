module.exports = function(app) {
    var controllers = require('./controllers');
    /*
    * Index Routing
    */
    app.get('/', function(req, res){
        controllers.index(req, res);
    });

    /*
    * Dashboard Routing
    */
    app.get('/dashboard', function(req, res) {
        controllers.dashboard(req, res);
    });
    
    /*
    * User Routing
    */
    app.get('/user/login', function(req, res) {
        controllers.user().login(req, res);
    });
    app.get('/user/logout', function(req, res) {
        controllers.user().logout(req, res);
    });
    app.get('/user/register', function(req, res) {
        controllers.user().register(req,res);
    });
    app.get('/user/:id', function(req, res) {
        controllers.user().details(req, res);
    });
    app.get('/user/:id/edit', function(req, res) {
        controllers.user().edit(req, res);
    });
    app.put('/user/:id/edit', function(req, res) {
        controllers.user().update(req, res);
    });
    
    /*
    * Companies Routing
    */
    app.get('/companies', function(req, res) {
        controllers.companies().list(req, res);
    });
    app.get('/companies/:company', function(req, res) {
        controllers.companies().view(req, res);
    });
    app.put('/companies/:company/add', function(req, res) {
        controllers.companies().add(req, res);
    });
    app.get('/companies/:company/remove', function(req, res) {
        controllers.companies().remove(req, res);
    });
    app.put('/companies/:company/remove', function(req, res) {
        controllers.companies().remove(req, res);
    });
    
    /*
    * Feed Routing
    */
    app.get('/feed', function(req, res) {
        controllers.feed().list(req, res);
    });
    app.get('/feed/:activity', function(req, res) {
        controllers.feed().view(req, res);
    });
    
    /*
    * News Routing
    */
    app.get('/news', function(req, res) {
        controllers.news().list(req, res);
    });
    app.get('/news/:company', function(req, res) {
        controllers.news().view(req, res);
    });
}