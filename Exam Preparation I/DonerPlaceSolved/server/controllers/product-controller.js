const productHelper = require('../utilities/productHelper');

module.exports = {
    createGet: (req, res) => {
        res.render('product/create');
    },
    createPost: async (req, res) => {
        let {category, url, size, toppings } = req.body;
        toppings = toppings.split(',').filter(x => x.length !== 0);
        try {
            await productHelper.createProduct({category, url, size, toppings});
            res.redirect('/');
        } catch (err) {
            res.locals.globalError = err.message;
            res.render('product/create');
        }
    }
};