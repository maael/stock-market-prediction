var express = require('express'),
    pub = __dirname + '/public',
    app = express(),
    port = process.env.PORT || 3000,
    routes = require('./app/routes'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    passport = require('passport'),
    pm2 = require('pm2');
/**
 * Configure and return application
 */
function getApp(dbURL) {
  /* Configure db */
  mongoose.connect(dbURL);
  /* Configure passport */
  require('./config/passport')(passport);
  /* Configure app */
  app.use(express.static(pub));
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set('views',__dirname + '/views');
  app.set('view engine','jade');
  app.use(session({ resave: false, saveUninitialized: false, secret: 'stockmarketprediction'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(function(req, res, next) {
    res.locals.message = req.flash();
    next();
  });
  /* Perform app routings */
  routes(app, passport);
  /* Return configured app */
  return app;
}
/**
 * Application and Details
 * @module app
 */
module.exports = {
  getApp: getApp,
  port: port 
};
