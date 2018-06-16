module.exports.index = function(req, res) {
    res.render('home', { isAuthenticated: req.user });
};