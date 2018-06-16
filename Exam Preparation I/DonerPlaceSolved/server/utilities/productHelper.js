const Product = require('mongoose').model('Product');

const validToppings = [
    'pickle', 'tomato', 'onion', 'lettuce', 'hot sauce', 'extra sauce'
];

async function createProduct(product) {
    product.toppings = product.toppings.filter(x => validToppings.includes(x));
    return await Product.create(product);
}

async function getAll() {
    return await Product.find({});
}

async function findById(id) {
    return await Product.findById(id);
}


module.exports = {
    createProduct,
    getAll,
    findById
}