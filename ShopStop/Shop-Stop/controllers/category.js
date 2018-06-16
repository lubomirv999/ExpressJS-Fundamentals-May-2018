const Category = require('../models/Category');

module.exports.addGet = (req, res) => {
    res.render('category/add');
};

module.exports.addPost = function(req, res) {
    const category = req.body;
    category.creator = req.user._id;

    Category.create(category).then(function() {
        category.save();
    });
    res.redirect('/');
};

module.exports.productByCategory = function(req, res) {
    const categoryName = req.params.category;

    Category.findOne({name: categoryName})
        .populate('products')
        .then(function(category) {
            if (!category) {
                res.sendStatus(404);
                return;
            }

            res.render('category/products', { category })
        });
};