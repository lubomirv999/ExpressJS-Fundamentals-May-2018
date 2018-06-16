const mongoose = require('mongoose');
let User = require('../data/User');
require('../data/Product');
require('../data/Order');

module.exports = (settings) => {
    mongoose.connect(settings.db);
    let connection = mongoose.connection;

    connection.once('open', (err) => {
        if(err){
            throw err;
        }
        console.log('MongoDb ready!');
        User.seedAdminUser();
    });
    connection.on('error', (err) => console.log('Database error: ' + err));
}