var controllers = require('./controllers'),
    api = require('./api');

module.exports = function(app, passport) {
    /*
    * Define check for authentication
    */
    function isAuthed(req, res, next) {
        if(req.isAuthenticated()) { return next(); }
        res.redirect('/');
    }
    function isAuthedAPI(req, res, next) {
        if(req.isAuthenticated()) { return next(); }
    }
    /* Parameters */
    app.param('company', function(req, res, next, symbol) {
        controllers.companies().get(req, res, next, symbol);
    });


    /*
    * Terry Pratchett Tribute
    * “A man's not dead while his name is still spoken”
    */
    app.get('/*',function(req,res,next){
        res.header('X-Clacks-Overhead' , 'GNU Terry Pratchett');
        next();
    });
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
    * API Routing
    */
    app.post('/api/user/company', isAuthedAPI, function(req, res) {
        api.user().company().put(req, res);
    });
    app.get('/api/company', isAuthedAPI, function(req, res) {
        api.company().get(req, res);
    });
    app.get('/api/news', isAuthedAPI, function(req, res) {
        api.news().get(req, res);
    });
    app.get('/api/process', isAuthedAPI, function(req, res) {
        api.process().get(req, res);
    });
    /*
    * User Routing
    */
    /* Unlinking Routes */
    app.get('/unlink/local', function(req, res) {
        controllers.unlink().local(req, res);
    });
    app.get('/unlink/facebook', function(req, res) {
        controllers.unlink().facebook(req, res);
    });
    app.get('/unlink/twitter', function(req, res) {
        controllers.unlink().twitter(req, res);
    });
    app.get('/unlink/google', function(req, res) {
        controllers.unlink().google(req, res);
    });
    app.get('/unlink/linkedin', function(req, res) {
        controllers.unlink().linkedin(req, res);
    });
    /* Authorisation Routes */
    app.get('/connect/local', function(req, res) {
        controllers.user().connect(req, res);
    });
    app.post('/connect/local', passport.authenticate('local-register', {
        successRedirect: '/feed',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));
    app.get('/connect/facebook/callback', passport.authorize('facebook', {
        successRedirect: '/feed',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/connect/twitter', passport.authorize('twitter', { scope: 'email' }));
    app.get('/connect/twitter/callback', passport.authorize('twitter', {
        successRedirect: '/feed',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));
    app.get('/connect/google/callback', passport.authorize('google', {
        successRedirect: '/feed',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/connect/linkedin', passport.authorize('linkedin'));
    app.get('/connect/linkedin/callback', passport.authorize('linkedin', {
        successRedirect: '/feed',
        failureRedirect: '/login',
        failureFlash: true
    }));
    /* Authentication Routes */
    app.get('/login', function(req, res) {
        controllers.user().login(req, res);
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/feed',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/feed',
        failureRedirect: '/login'
    }));
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/feed',
        failureRedirect: '/login'
    }));
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/feed',
        failureRedirect: '/login'
    }));
    app.get('/auth/linkedin', passport.authenticate('linkedin'));
    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
        successRedirect: '/feed',
        failureRedirect: '/login'
    }));
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
};