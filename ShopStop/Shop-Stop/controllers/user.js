const User = require('../models/User');
const encryption = require('../utilities/encryption');

module.exports.registerGet = function(req, res) {
    res.render('user/register');
};

module.exports.registerPost = function(req, res) {
    const user = req.body;

    if (user.password && user.password !== user.confirmedPassword) {
        user.error = 'Password do not match.';
        return res.render('user/register', user);
    }

    const salt = encryption.generateSalt();
    user.salt = salt;

    if (user.password) {
        const hashedPassword = encryption.generateHashedPassword(salt, user.password);
        user.password = hashedPassword;
    }

    User.create(user)
        .then(function(user) {
            req.logIn(user, function(error, user) {
                if (error) {
                    return res.render('user/register', {error: 'Authentication not working'});
                }

                res.redirect('/');
            });
        })
        .catch(function(error) {
            user.error = error;
            res.render('user/register', user);
        });
};

module.exports.loginGet = function(req, res) {
    res.render('user/login');
};

module.exports.loginPost = function(req, res) {
    const userToLogin = req.body;

    User.findOne({ username: userToLogin.username }).then(function(user) {
        if (!user || !user.authenticate(userToLogin.password)) {
            res.render('user/login', { error: 'Invalid credentials!' });
        } else {
            req.logIn(user, function(error, user) {
                if (error) {
                    return res.render('user/login', {error: 'Authentication not working'});
                }

                res.redirect('/');
            });
        }
    });
};

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};
