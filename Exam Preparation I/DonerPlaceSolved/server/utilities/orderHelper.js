const Order = require('mongoose').model('Order');


async function create(order) {
    return await Order.create(order);
}

async function getAll(){
    return await Order.find({});
}

async function getByUserId(id) {
    return await Order.find({creator: id}).populate('product');
}

async function getById(id) {
    return await Order.findById(id).populate('product');
}

async function updateStatus(id, status) {
    return await Order.findByIdAndUpdate(id, {$set: {status: status}});
}

module.exports = {
    create,
    getAll,
    getByUserId,
    getById,
    updateStatus
}