const homeController = require('../controllers/home-controller');
const booksController = require('../controllers/books-controller');

module.exports = (app) => {
    app.get('/', homeController.getIndex);
    app.get('/add', booksController.getAddBook);
    app.post('/add', booksController.postAddBook);
    app.get('/all', booksController.getAll);
    app.get('/details/:id', booksController.getDetails);
};