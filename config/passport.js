var LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
	User = require('../app/models/user'),
	configAuth = require('./auth');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	passport.use(new LinkedInStrategy({
	  	clientID: configAuth.linkedInAuth.clientID,
	  	clientSecret: configAuth.linkedInAuth.clientSecret,
	  	callbackURL: configAuth.linkedInAuth.callbackURL,
	  	passReqToCallback: true,
	  	scope: ['r_emailaddress', 'r_basicprofile'],
    	state: true
	}, 
	function(req, accessToken, refreshToken, profile, done) {
	  	process.nextTick(function () {
	  		if(!req.user) {
				User.findOne({ 'linkedin.id': profile.id }, function(err, user) {
					if(err) return done(err);
					if(user) {
						if (!user.linkedin.token) {
                            user.linkedin.token = accessToken;
                            user.linkedin.name = profile.displayName;
                            user.linkedin.email = profile.emails[0].value;
                            user.save(function(err) {
                                if (err) throw err;
                                return done(null, user);
                            });
                        }
						return done(null, user);
					} else {
						var newUser = new User();
						newUser.linkedin.id = profile.id;
	                    newUser.linkedin.token = accessToken;
	                    newUser.linkedin.name  = profile.displayName;
	                    newUser.linkedin.email = profile.emails[0].value;
	                    newUser.save(function(err) {
	                    	if(err) throw err;
	                    	return done(null, newUser);
	                    });
					}
				});
			}  else {
				var user = req.user;
				user.linkedin.id = profile.id;
	            user.linkedin.token = accessToken;
	            user.linkedin.name  = profile.displayName;
	            user.linkedin.email = profile.emails[0].value;
				user.save(function(err) {
					if(err) throw err;
					return done(null, user);
				});
			}
	  	});
	}));

	passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
	  	passReqToCallback: true
	},
	function(req, token, refreshToken, profile, done) {
		process.nextTick(function() {
			if(!req.user) {
				User.findOne({ 'google.id': profile.id }, function(err, user) {
					if(err) return done(err);
					if(user) {
						if (!user.google.token) {
                            user.google.token = token;
                            user.google.name = profile.displayName;
                            user.google.email = profile.emails[0].value;
                            user.save(function(err) {
                                if (err) throw err;
                                return done(null, user);
                            });
                        }
						return done(null, user);
					} else {
						var newUser = new User();
						newUser.google.id = profile.id;
	                    newUser.google.token = token;
	                    newUser.google.name  = profile.displayName;
	                    newUser.google.email = profile.emails[0].value;
	                    newUser.save(function(err) {
	                    	if(err) throw err;
	                    	return done(null, newUser);
	                    });
					}
				});
			}  else {
				var user = req.user;
				user.google.id = profile.id;
	            user.google.token = token;
	            user.google.name  = profile.displayName;
	            user.google.email = profile.emails[0].value;
				user.save(function(err) {
					if(err) throw err;
					return done(null, user);
				});
			}
		});
	}));

	passport.use(new TwitterStrategy({
 		consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL,
	  	passReqToCallback: true
	},
	function(req, token, tokenSecret, profile, done) {
		process.nextTick(function() {
			if(!req.user) {
				User.findOne({ 'twitter.id': profile.id }, function(err, user) {
					if(err) return done(err);
					if(user) {
						if (!user.twitter.token) {
                            user.twitter.token = token;
                            user.twitter.name = profile.username;
                            user.twitter.displayName = profile.displayName;
                            user.save(function(err) {
                                if (err) throw err;
                                return done(null, user);
                            });
                        }
						return done(null, user);
					} else {
						var newUser = new User();
						newUser.twitter.id = profile.id;
	                    newUser.twitter.token = token;
	                    newUser.twitter.username = profile.username;
	                    newUser.twitter.displayName = profile.displayName;
	                    newUser.save(function(err) {
	                    	if(err) throw err;
	                    	return done(null, newUser);
	                    });
					}
				});
			}  else {
				var user = req.user;
				user.twitter.id = profile.id;
	            user.twitter.token = token;
	            user.twitter.username = profile.username;
	            user.twitter.displayName = profile.displayName;
				user.save(function(err) {
					if(err) throw err;
					return done(null, user);
				});
			}
		});
	}));

	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
	  	passReqToCallback: true
	},
	function(req, token, refreshToken, profile, done) {
		process.nextTick(function() {
			if(!req.user) {
				User.findOne({ 'facebook.id': profile.id }, function(err, user) {
					if(err) return done(err);
					if(user) {
						if (!user.facebook.token) {
                            user.facebook.token = token;
							user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
							user.facebook.email = profile.emails[0].value;
                            user.save(function(err) {
                                if (err) throw err;
                                return done(null, user);
                            });
                        }
						return done(null, user);
					} else {
						var newUser = new User();
						newUser.facebook.id = profile.id;
						newUser.facebook.token = token;
						newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;
						newUser.save(function(err) {
							if(err) throw err;
							return done(null, newUser);
						});
					}
				});
			} else {
				var user = req.user;
				user.facebook.id = profile.id;
				user.facebook.token = token;
				user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
				user.facebook.email = profile.emails[0].value;
				user.save(function(err) {
					if(err) throw err;
					return done(null, user);
				});
			}
		});
	}));

	passport.use('local-register', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({ 'local.email': email }, function(err, user) {
				if(err) return done(err);
				if(user) return done(null, false, req.flash('registerMessage', 'That email is already in use.'));
				if(req.user) {
					var user = req.user;
					user.local.email = email;
					user.local.password = user.generateHash(password);
					user.save(function(err) {
						if(err) throw err;
						return done(null, user);
					})
				} else {
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.save(function(err) {
						if(err) throw err;
						return done(null, newUser);
					})
				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		User.findOne({ 'local.email': email }, function(err, user) {
			if(err) return done(err);
			if(!user || !user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Could not log you in.'));
			return done(null, user);
		});
	}));
};