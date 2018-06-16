const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const exphbs = require('express-handlebars');

module.exports = function(app) {
    app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
    app.set('view engine', 'hbs');

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
        if (req.url.startsWith('/public')) {
            req.url = req.url.replace('/public', '');
        }

        next();
    }, express.static('public'));
};