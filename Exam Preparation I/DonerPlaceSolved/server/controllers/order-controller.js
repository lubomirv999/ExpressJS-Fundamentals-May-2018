const productHelper = require('../utilities/productHelper');
const orderHelper = require('../utilities/orderHelper');

module.exports = {
    createGet: async (req, res) => {
        let productId = req.params.productId;
        let product = await productHelper.findById(productId);
        res.render('order/create', product);
    },
    createPost: async (req, res) => {
        let order = {};
        let product = req.body['product_id'];
        let creator = req.user._id;
        order.product = product;
        order.creator = creator;
        for (let key in req.body) {
            if (key === 'product_id') {
                continue;
            }
            order[key] = req.body[key];
        }
        try {
            let createdObject = await orderHelper.create(order);
            res.redirect('/');
        } catch (err) {
            res.locals.globalError = err.message;
            res.render('product/create');
        }
    },
    statusGet: async (req, res) => {
        let isAdmin = req.user && req.user.roles.includes('Admin');
        if (isAdmin) {
            let orders = await orderHelper.getAll();
            res.render('order/status-admin', { orders: orders });
        } else {
            let orders = await orderHelper.getByUserId(req.user._id);
            res.render('order/status', { orders: orders });
        }
    },
    detailsGet: async (req, res) => {
        try {
            let order = await orderHelper.getById(req.params.id);
            res.render('order/details', {
                order: order, isPending: order.status == 'Pending', isInProgress: order.status == 'In progress',
                isInTransit: order.status == 'In transit', isDelivered: order.status == 'Delivered'
            });
        } catch (err) {
            res.locals.globalError = err.message;
            res.redirect('/');
        }
    },
    statusPost: async (req, res) => {
        for(let key in req.body){
            await orderHelper.updateStatus(key, req.body[key]);
        }
        res.redirect('/');
    }
}