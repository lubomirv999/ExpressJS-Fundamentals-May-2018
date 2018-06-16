const fs = require('fs');

const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports.addGet = function(req, res) {
    Category.find().then((categories => {
        res.render('product/add', {categories})
    }));
};

module.exports.addPost = function(req, res) {
    const productObj = req.body;
    productObj.image = '\\' + req.file.path;
    productObj.creator = req.user._id;

    Product.create(productObj).then(function(product) {
        Category.findById(product.category).then(function(category) {
            category.products.push(product._id);
            category.save();
        });
        res.redirect('/');
    });
};

module.exports.editGet = function(req, res) {
    const id = req.params.id;
    Product.findById(id).then(function(product) {
        if (!product) {
            res.redirect(404);
            return;
        }

        if (product.creator.equals(req.user._id) || req.user.roles.indexOf('Admin' >= 0)) {
            Category.find().then(function(categories) {
                res.render('product/edit', {product, categories});
            });
        } else {
            res.redirect('/');
        }
    });
};

module.exports.editPost = function(req, res) {
    const id = req.params.id;
    const editedProduct = req.body;

    Product.findById(id).then(function(product) {
        if (!product) {
            res.redirect(`/?error=${encodeURIComponent('error=Product was not found!')}`);
            return;
        }

        if (product.creator.equals(req.user._id) || req.user.roles.indexOf('Admin' >= 0)) {
            product.name = editedProduct.name;
            product.description = editedProduct.description;
            product.price = editedProduct.price;

            if (req.file) {
                product.image = '\\' + req.file.path;
            }

            if (product.category.toString() !== editedProduct.category) {
                Category.findById(product.category).then(function(currentCategory) {
                    Category.findById(editedProduct.category).then(function(nextCategory) {
                        const index = currentCategory.products.indexOf(product._id);
                        if (index >= 0) {
                            currentCategory.products.splice(index, 1);
                        }
                        currentCategory.save();

                        nextCategory.products.push(product._id);
                        nextCategory.save();

                        product.category = editedProduct.category;

                        product.save().then(() => {
                            res.redirect('/?success=' + encodeURIComponent('Product was edited successfully!'))
                        });
                    });
                });
            }
        } else {
            res.redirect('/');
        }
    })
};

module.exports.deleteGet = function(req, res) {
    const id = req.params.id;
    Product.findById(id).then(function(product) {
        if (!product) {
            res.sendStatus(404);
            return;
        }

        if (product.creator.equals(req.user._id) || req.user.roles.indexOf('Admin' >= 0)) {
            return res.render('product/delete', {product});
        }

        res.redirect('/');
    });
};

module.exports.deletePost = function(req, res) {
    const id = req.params.id;

    Product.findByIdAndDelete(id).then(function(product) {
        if (!product) {
            res.sendStatus(404);
            return;
        }

        Product
            .findById(id)
            .then(function(productToRemove) {

                if (!productToRemove) {
                    res.status(404)
                        .send('File not found');
                    return;
                }

                if (productToRemove.creator.equals(req.user._id) || req.user.roles.indexOf('Admin') >= 0) {
                    Category.findById(productToRemove.category)
                        .then(function(categoryToEdit) {
                            const index = categoryToEdit.products.indexOf(productToRemove._id);

                            if (index >= 0) {
                                categoryToEdit.products.splice(index, 1);
                            }

                            categoryToEdit
                                .save()
                                .then(function() {
                                    productToRemove.remove().then(function() {
                                        fs.unlink('.' + productToRemove.image, () => {
                                            return res.redirect('/?success=' + encodeURIComponent('Product was deleted successfully!'));
                                        });
                                        res.redirect(`/?success=${encodeURIComponent('Product was deleted successfully!')}`);
                                    });
                                });
                        });
                }
            });
    });
};

module.exports.buyGet = function(req, res) {
    const id = req.params.id;

    Product.findById(id).then(function(product) {
        if (!product) {
            res.sendStatus(404);
            return;
        }

        res.render('product/buy', {product})
    });
};

module.exports.buyPost = function(req, res) {
    const productId = req.params.id;

    Product.findById(productId).then(function(product) {
        if (product.buyer) {
            const error = `error=${encodeURIComponent('Product was already bought!')}`;
            return res.redirect(`/?${error}`);
        }

        product.buyer = req.user._id;
        product.save().then(function() {
            req.user.boughtProducts.push(productId);
            req.user.save().then(() => res.redirect('/'));
        });
    });
};