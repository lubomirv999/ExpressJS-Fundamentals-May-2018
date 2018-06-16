module.exports = {
    isAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else  {
            res.redirect('/user/login');
        }
    },
    isInRole: function(role) {
        return function(req, res, next) {
            if (req.user && req.user.roles.indexOf(role) > -1) {
                next();
            } else if (req.user) {
                res.redirect('/');
            } else{
                res.redirect('/user/login');
            }
        }
    },
    isAlreadyAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/');
        }
    }
};