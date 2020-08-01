const passport = require('passport');
const User = require('../models/user');

passport.serializeUser(function (user, next) {
    next(null, user._id);
});

passport.deserializeUser(function (_id, next) {
    User.findOne({_id}, (err, user) => {
        if (err) return next(err);
        if (!user) return next(null, false);
        return next(null, user.toWeb());
    });
});

module.exports = passport;
