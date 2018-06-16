const Product = require('../models/Product');

module.exports.index = function(req, res) {
    const queryData = req.query;

    Product.find({buyer: null}).populate('category').then(function(products) {
        if (queryData.query) {
            products = products.filter(p => p.name.toLowerCase().includes(queryData.query));
        }

        const data = {products};
        if (req.query.error) {
            data.error = req.query.error;
        } else if (req.query.success) {
            data.success = req.query.success;
        }

        res.render('home/index', data);
    });
};