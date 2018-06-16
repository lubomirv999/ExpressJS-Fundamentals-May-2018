const passport = require('passport');
const LocalPassport = require('passport-local');
const User = require('../models/User');

module.exports = function() {
    passport.use(new LocalPassport(function(username, password, done) {
        User.findOne({ username }).then(function(user) {
            if (!user || !user.authenticate(password)) {
                return done(null, false);
            }

            return done(null, user);
        });
    }));

    passport.serializeUser(function(user, done) {
        if (user) {
            return done(null, user._id);
        }
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            return !user ? done(null, false) : done(null, user);
        });
    });
};