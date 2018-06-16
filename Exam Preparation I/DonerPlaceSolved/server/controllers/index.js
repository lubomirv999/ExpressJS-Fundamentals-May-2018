const home = require('./home-controller');
const user = require('./user-controller');
const product = require('./product-controller');
const order = require('./order-controller');

module.exports = {
    home: home,
    user: user,
    product: product,
    order: order
};