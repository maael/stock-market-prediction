var controllers = require('./controllers'),
    api = require('./api');
/**
 * Routing
 * @module routes
 * @see module:api
 * @see module:controllers
 */
module.exports = function(app, passport) {
    /*
     * General Authentication, redirects if unauthenticated
     * @private
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     * @param {function} next - next function provided by Express
     */
    function isAuthed(req, res, next) {
        if(req.isAuthenticated()) { return next(); }
        res.redirect('/');
    }

    /*
     * API Authentication, drops if unauthenticated
     * @private
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     * @param {function} next - next function provided by Express
     */
    function isAuthedAPI(req, res, next) {
        if(req.isAuthenticated()) { return next(); }
    }
    /**
     * Fills the company variable in a request if the page includes a company
     * @function fillCompany
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     * @param {function} next - next function provided by Express
     * @param {string} symbol - symbol of company used by page
     */
    app.param('company', function(req, res, next, symbol) {
        controllers.companies().get(req, res, next, symbol);
    });
    /**
     * Tribute to Terry Pratchett - “A man's not dead while his name is still spoken”
     * @function terryPratchettTribute
     * @param {object} req - request object provided by Express
     * @param {object} res - response object provided by Express
     * @param {function} next - next function provided by Express
     */
    app.get('/*',function(req,res,next){
        res.header('X-Clacks-Overhead' , 'GNU Terry Pratchett');
        next();
    });
    /**
     * Index Routing
     * @function indexRouting
     * @see module:controllers.index
     */
    app.get('/', function(req, res){
        controllers.index(req, res);
    });
    /**
     * Dashboard Routing
     * @function dashboardRouting
     * @see module:controllers.dashboard
     */
    app.get('/dashboard', isAuthed, function(req, res) {
        controllers.dashboard(req, res);
    });
    /**
     * API Routing Functions - Return JSON objects
     * @see module:api
     */
    /**
     * API - User/Company - Adds a company to the system, authenticated user automatically follows the company
     * @function apiUserCompany
     * @returns {object}
     * @see module:api.user
     */
    app.post('/api/user/company', isAuthedAPI, function(req, res) {
        api.user().company().put(req, res);
    });
    /**
     * API - Company - Returns information on a company as JSON
     * @function apiCompany
     * @returns {object}
     * @see module:api.company
     */
    app.get('/api/company', isAuthedAPI, function(req, res) {
        api.company().get(req, res);
    });
    /**
     * API - News - Returns recent news information as JSON
     * @function apiNews
     * @returns {object}
     * @see module:api.news
     */
    app.get('/api/news', isAuthedAPI, function(req, res) {
        api.news().get(req, res);
    });
    /**
     * API - Process - Returns information on a process as JSON
     * @function apiProcess
     * @returns {object}
     * @see module:api.process
     */
    app.get('/api/process', isAuthedAPI, function(req, res) {
        api.process().get(req, res);
    });
    /**
     * User Routing
     * @see module:controllers
     */
    /**
     * Unlinking Routing
     * @see module:controllers.unlink
     */
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
    /**
     * Authorisation/Account Connecting Routing
     * @see {@link http://passportjs.org/}
     */
    app.get('/connect/local', function(req, res) {
        controllers.user().connect(req, res);
    });
    app.post('/connect/local', passport.authenticate('local-register', {
        successRedirect: '/companies',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));
    app.get('/connect/facebook/callback', passport.authorize('facebook', {
        successRedirect: '/companies',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/connect/twitter', passport.authorize('twitter', { scope: 'email' }));
    app.get('/connect/twitter/callback', passport.authorize('twitter', {
        successRedirect: '/companies',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));
    app.get('/connect/google/callback', passport.authorize('google', {
        successRedirect: '/companies',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/connect/linkedin', passport.authorize('linkedin'));
    app.get('/connect/linkedin/callback', passport.authorize('linkedin', {
        successRedirect: '/companies',
        failureRedirect: '/login',
        failureFlash: true
    }));
    /**
     * Authentication Routing
     * @see {@link http://passportjs.org/}
     * @see module:passport
     */
    app.get('/login', function(req, res) {
        controllers.user().login(req, res);
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/companies',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/companies',
        failureRedirect: '/login'
    }));
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/companies',
        failureRedirect: '/login'
    }));
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/companies',
        failureRedirect: '/login'
    }));
    app.get('/auth/linkedin', passport.authenticate('linkedin'));
    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
        successRedirect: '/companies',
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
    /**
     * Authentication Routing
     * @see module:controllers.companies
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
    
    /**
     * Feed Routing
     * @see module:controllers.feed
     */
    app.get('/feed', isAuthed, function(req, res) {
        controllers.feed().list(req, res);
    });
    app.get('/feed/:activity', isAuthed, function(req, res) {
        controllers.feed().view(req, res);
    });
    
    /**
     * News Routing
     * @see module:controllers.news
     */
    app.get('/news', isAuthed, function(req, res) {
        controllers.news().list(req, res);
    });
};