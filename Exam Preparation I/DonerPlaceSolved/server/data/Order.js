const mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    date: {type: Date, default: Date.now},
    toppings: {type: [String], required: true},
    status: {type: String, enum: ['Pending', 'In progress', 'In transit', 'Delivered'], default: 'Pending'}
});

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;