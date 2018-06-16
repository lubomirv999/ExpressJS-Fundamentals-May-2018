const productHelper = require('../utilities/productHelper');

module.exports = {
    index: async (req, res) => {
        let allDoners = await productHelper.getAll();
        let chickenDoners = allDoners.filter(x => x.category === 'chicken');
        let lambDoners = allDoners.filter(x => x.category === 'lamb');
        let beefDoners = allDoners.filter(x => x.category === 'beef');
        let isAdmin = req.user && req.user.roles.includes('Admin');
        res.render('home/index', {
            isAdmin: isAdmin, chickenDoners: chickenDoners,
            lambDoners: lambDoners, beefDoners: beefDoners
        });
    },
};