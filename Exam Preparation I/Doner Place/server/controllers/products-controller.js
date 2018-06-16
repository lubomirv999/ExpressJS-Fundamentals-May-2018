const Product = require('mongoose').model('Product');

module.exports = {
    createProductGet: (req, res) => {
        res.render('product/create');
    },
    createProductPost: (req, res) => {
        const product = req.body;
        const parsedToppings = product.toppings.trim().split(',');

        Product.create({
            category: product.category,
            size: product.size,
            imageUrl: product.imageUrl,
            toppings: parsedToppings
        });

        console.log('Product created successfully');
        return res.render('home/index');
    }
};
