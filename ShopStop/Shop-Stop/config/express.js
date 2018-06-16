const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

module.exports = function(app) {
    app.set('view engine', 'pug');
    app.set('views', 'views');

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cookieParser());
    app.use(session({secret: 'S3cr3t', saveUninitialized: false, resave: false}));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function(req, res, next) {
        if (req.user) {
            res.locals.user = req.user;
        }

        next();
    });

    app.use(function(req, res, next) {
        if (req.url.startsWith('/content')) {
            req.url = req.url.replace('/content', '');
        }

        next();
    }, express.static('content'));
};