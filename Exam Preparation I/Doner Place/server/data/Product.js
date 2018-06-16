const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    category: { type: String, enum: ['chicken', 'lamb', 'beef'], required: true },
    size: { type: Number, min: 17, max: 21, required: true },
    imageUrl: { type: String, required: true },
    toppings: {
        type: [String], enum: ['pickle', 'tomato', 'onion', 'lettuce', 'hot sauce',
            'extra sauce']
    }
});

module.exports = mongoose.model('Product', productSchema);