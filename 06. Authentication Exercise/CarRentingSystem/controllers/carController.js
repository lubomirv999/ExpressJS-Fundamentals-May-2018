const Car = require('../models/Car');
const User = require('../models/User');

module.exports.createGet = function(req, res) {
    res.render('car/create', { isAuthenticated: true });
};

module.exports.createPost = function(req, res) {
    const carObj = req.body;

    Car.create(carObj)
        .then(function(car) {
            car.save();
            res.render('car/create', { error: 'Car created', isAuthenticated: true });
        })
        .catch(function(error) {
            const index = error.message.lastIndexOf(':') + 2;
            const message = error.message.slice(index);
            res.render('car/create', { error: message, isAuthenticated: true });
        });
};

module.exports.editGet = function(req, res) {
    const id = req.params.id;

    Car.findById(id).then(function(car) {
        res.render('car/edit', { car, isAuthenticated: true, id });
    });
};

module.exports.editPost = function(req, res) {
    const id = req.params.id;
    const carObj = req.body;

    Car.findByIdAndUpdate(id, { $set: carObj }, {new: true, runValidators: true}, function(error, car) {
        if (error) {
            const index = error.message.lastIndexOf(':') + 2;
            const message = error.message.slice(index);
            return res.render('car/edit', { error: message, car: carObj, id, isAuthenticated: true });
        }

        res.redirect('/car/all');
    })
};

module.exports.viewAll = function(req, res) {
    Car.find({rented: false})
        .then(function(cars) {
            res.render('car/all', { cars, isAuthenticated:true });
        });
};

module.exports.rent = function(req, res) {
    const id = req.params.id;

    Car.findById(id).then(function(car) {
        car.rented = true;
        car.rentCount = car.rentCount + 1;
        car.save().then(function(error, car) {
            User.findById(req.user._id).then(function(user) {
                user.rentedCars.push(id);
                user.save();
                res.redirect('/car/all');
            });
        });
    });
};

module.exports.return = function(req, res) {
    const id = req.params.id;

    Car.findById(id).then(function(car) {
        car.rented = false;
        car.save().then(function(error, car) {
            User.findById(req.user._id).then(function(user) {
                const index = user.rentedCars.indexOf(id);
                user.rentedCars.splice(index, 1);
                user.save();
                res.redirect('/car/all');
            });
        });
    });
};
