const User = require('../data/User');
const encryption = require('../utilities/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost: (req, res) => {
        let reqUser = req.body;
        
        let salt = encryption.generateSalt();
        let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password);

        User.create({
            username: reqUser.username,
            firstName: reqUser.firstName,
            lastName: reqUser.lastName,
            salt: salt,
            hashedPass: hashedPassword
        }).then(user => {
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('user/register', user);
                    return;
                };

                res.redirect('/');
            });
        });
    },

    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },
    
    loginPost: (req, res) => {
        let reqUser = req.body;
        User.findOne({ username: reqUser.username }).then((user) => {
          let userSalt = user.salt;
          let userHashedPwd = user.hashedPass;
          let reqHashedPwd = encryption.generateHashedPassword(userSalt, reqUser.password);
          if (userHashedPwd !== reqHashedPwd) {
            res.render('user/login', { globalError: 'Invalid username or password' });
          } else {
            req.logIn(user, (err, user) => {
              if (err) { };
              res.redirect('/');
            });
          };
        });
    },    
};