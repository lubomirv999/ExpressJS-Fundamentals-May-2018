const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: 'String', required: true },
    description: { type: 'String', },
    price: { type: 'Number', min: 0, max: Number.MAX_VALUE, default: 0 },
    image: { type: 'String' },
    creator: { type: 'ObjectId', ref: 'User', required: true },
    buyer: { type: 'ObjectId', ref: 'User' },
    category: { type: 'ObjectId' , ref: 'Category' }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;