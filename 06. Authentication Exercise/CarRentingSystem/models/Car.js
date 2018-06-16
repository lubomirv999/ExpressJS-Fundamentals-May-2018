const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    make: {
        type: 'String',
        required: 'Make required'
    },
    model: {
        type: 'String',
        required: 'Model required'
    },
    color: {
        type: 'String'
    },
    imageUrl: {
        type: 'String',
        required: 'ImageURL required' },
    rented: {
        type: 'Boolean',
        default: false
    },
    rentCount: {
        type: 'Number',
        default: 0
    }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;