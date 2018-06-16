const mongoose = require('mongoose');
const encrypto = require('../utilities/encryption');
const propertyIsRequired = '{0} is required';

const userSchema = mongoose.Schema({
    username: {
        type: 'String',
        required: propertyIsRequired.replace('{0}', 'Username'),
        unique: true
    },
    password: {
        type: 'String',
        required: propertyIsRequired.replace('{0}', 'Password')
    },
    salt: {
        type: 'String',
        required: true
    },
    firstName: {
        type: 'String',
        required: propertyIsRequired.replace('{0}', 'First name')
    },
    lastName: {
        type: 'String',
        required: propertyIsRequired.replace('{0}', 'Password')
    },
    age: {
        type: 'Number',
        min: [0, 'Age must be between 0 and 120'],
        max: [120, 'Age must be between 0 and 120']
    },
    gender: {
        type: 'String',
        enum: {
            values: ['Male', 'Female'],
            message: 'Gender should be either "Male" or "Female".'
        }
    },
    roles: [{ type: 'String' }],
    boughtProducts: [{ type: 'ObjectId', ref: 'Product' }],
    createdProducts: [{ type: 'ObjectId', ref: 'Product' }],
    createdCategories: [{ type: 'ObjectId', ref: 'Category' }],
});

userSchema.methods.authenticate = function(password) {
    const hashedPassword = encrypto.generateHashedPassword(this.salt, password);

    return hashedPassword === this.password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

module.exports.seedAdminUser = function() {
    User.find({username: 'admin'}).then(function(users) {
        if (users.length === 0) {
            const salt = encrypto.generateSalt();
            const hashedPass = encrypto.generateHashedPassword(salt, 'Admin12');

            User.create({
                username: 'admin',
                firstName: 'Chuck',
                lastName: 'Test',
                salt: salt,
                password: hashedPass,
                age: 33,
                gender: 'Male',
                roles: ['Admin']
            });
        }
    });
};