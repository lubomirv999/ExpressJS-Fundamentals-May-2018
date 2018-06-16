const mongoose = require('mongoose');
const encrypto = require('../utilities/encryption');

const userSchema = mongoose.Schema({
    username: {
        type: 'String',
        required: 'Username is required',
        unique: true
    },
    password: {
        type: 'String',
        required: 'Password is required'
    },
    rentedCars: [{
        type: 'ObjectId',
        ref: 'Car'
    }],
    roles: [{
        type: 'String'
    }],
    salt: {
        type: 'String',
        required: true
    }
});

userSchema.methods.authenticate = function(password) {
    const hashedPassword = encrypto.generateHashedPassword(this.salt, password);

    return hashedPassword === this.password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;