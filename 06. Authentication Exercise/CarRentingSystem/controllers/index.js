const homeController = require('./homeController');
const userController = require('./userController');
const carController = require('./carController');

module.exports = {
    home: homeController,
    user: userController,
    car: carController
};