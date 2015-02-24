module.exports = function(app, passport) {
    var controllers = require('./controllers');

    /*
    * Define check for authentication
    */
    function isAuthed(req, res, next) {
        if(req.isAuthenticated()) return next();
        res.redirect('/');
    }

    /*
    * Index Routing
    */
    app.get('/', function(req, res){
        controllers.index(req, res);
    });

    /*
    * Dashboard Routing
    */
    app.get('/dashboard', isAuthed, function(req, res) {
        controllers.dashboard(req, res);
    });
    
    /*
    * User Routing
    */
    app.get('/login', function(req, res) {
        controllers.user().login(req, res);
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/user',
        failureRedirect: '/login',
        failureFlash: true
    }))
    app.get('/logout', function(req, res) {
        controllers.user().logout(req, res);
    });
    app.get('/register', function(req, res) {
        controllers.user().register(req,res);
    });
    app.post('/register', passport.authenticate('local-register', {
        successRedirect: '/user',
        failureRedirect: '/register',
        failureFlash: 'This email is unavailable.'
    }));
    app.get('/user', isAuthed, function(req, res) {
        controllers.user().details(req, res);
    });
    app.get('/user/edit', isAuthed, function(req, res) {
        controllers.user().edit(req, res);
    });
    app.put('/user/edit', isAuthed, function(req, res) {
        controllers.user().update(req, res);
    });
    
    /*
    * Companies Routing
    */
    app.get('/companies', isAuthed, function(req, res) {
        controllers.companies().list(req, res);
    });
    app.get('/companies/:company', isAuthed, function(req, res) {
        controllers.companies().view(req, res);
    });
    app.put('/companies/:company/add', isAuthed, function(req, res) {
        controllers.companies().add(req, res);
    });
    app.get('/companies/:company/remove', isAuthed, function(req, res) {
        controllers.companies().remove(req, res);
    });
    app.put('/companies/:company/remove', isAuthed, function(req, res) {
        controllers.companies().remove(req, res);
    });
    
    /*
    * Feed Routing
    */
    app.get('/feed', isAuthed, function(req, res) {
        controllers.feed().list(req, res);
    });
    app.get('/feed/:activity', isAuthed, function(req, res) {
        controllers.feed().view(req, res);
    });
    
    /*
    * News Routing
    */
    app.get('/news', isAuthed, function(req, res) {
        controllers.news().list(req, res);
    });
    app.get('/news/:company', isAuthed, function(req, res) {
        controllers.news().view(req, res);
    });
}