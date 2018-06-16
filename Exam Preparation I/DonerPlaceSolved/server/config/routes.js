const controllers = require('../controllers');
const auth = require('../config/auth');

module.exports = (app) => {
    app.get('/', controllers.home.index);

    app.get('/user/register', controllers.user.registerGet);
    app.post('/user/register', controllers.user.registerPost);

    app.post('/user/logout', controllers.user.logout);

    app.get('/user/login', controllers.user.loginGet);
    app.post('/user/login', controllers.user.loginPost);

    app.get('/product/create', auth.isInRole('Admin'), controllers.product.createGet);
    app.post('/product/create', auth.isInRole('Admin'), controllers.product.createPost);

    app.get('/order/create/:productId', auth.isAuthenticated, controllers.order.createGet);
    app.post('/order/create/', auth.isAuthenticated, controllers.order.createPost);

    app.get('/order/status', auth.isAuthenticated, controllers.order.statusGet);
    app.post('/order/status', auth.isInRole('Admin'), controllers.order.statusPost);

    app.get('/order/details/:id', auth.isAuthenticated, controllers.order.detailsGet);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('Not found');
    });
};