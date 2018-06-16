const mongoose = require('mongoose');
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required';

let productSchema = new mongoose.Schema({
    category: {type: String, enum: ["chicken", "lamb", "beef"], required: REQUIRED_VALIDATION_MESSAGE},
    size: {type: Number, min: 17, max: 24, required: REQUIRED_VALIDATION_MESSAGE},
    url: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
    toppings: {type: [String]}
});

productSchema.virtual('fullName').get(function () {
    return this.category + " " + this.size + " cm"; 
})

let Product = mongoose.model('Product', productSchema);

module.exports = Product;