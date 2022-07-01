var User = require('../models/user');
var Article = require('../models/article');
var Comment = require('../models/comment');

module.exports = {
  UserLoggedIn: (req, res, next) => {
    if (req.session && req.session.Id) {
      next();
    } else {
      req.flash(
        'error',
        "YOu haven't logged in yet, Please Login to continue!"
      );
      res.redirect('/register/login');
    }
  },
  userInfo: (req, res, next) => {
    var userId = req.session && req.session.Id;
    if (userId) {
      User.findById(userId, 'username email', (err, user) => {
        if (err) {
          return next(err);
        }
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};
