const controllers = require('../controllers');
const auth = require('./auth');

module.exports = function(app) {
    app.get('/', controllers.home.index);

    app.get('/user/register', auth.isAlreadyAuthenticated,controllers.user.registerGet);
    app.post('/user/register', auth.isAlreadyAuthenticated,controllers.user.registerPost);

    app.get('/user/login', auth.isAlreadyAuthenticated,controllers.user.loginGet);
    app.post('/user/login', auth.isAlreadyAuthenticated,controllers.user.loginPost);

    app.get('/user/logout', auth.isAuthenticated, controllers.user.logout);

    app.get('/user/profile/me', auth.isAuthenticated, controllers.user.profile);

    app.get('/car/create', auth.isInRole('Admin'), controllers.car.createGet);
    app.post('/car/create', auth.isInRole('Admin'), controllers.car.createPost);

    app.get('/car/all', auth.isAuthenticated, controllers.car.viewAll);

    app.get('/car/edit/:id', auth.isInRole('Admin'), controllers.car.editGet);
    app.post('/car/edit/:id', auth.isInRole('Admin'), controllers.car.editPost);

    app.get('/car/rent/:id', auth.isAuthenticated, controllers.car.rent);

    app.get('/car/return/:id', auth.isAuthenticated, controllers.car.return)
};