const config = require('../config');
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/user');

module.exports = (passport) => {
    passport.use(
        'login',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            async function (req, email, password, done) {
                try {
                    const user = await User.findOne({email});
                    if (user) {
                        if (user.comparePassword(password)) {
                            return done(null, user.toWeb());
                        }
                    }
                    return done(null, false);
                } catch (error) {
                    return done(error, false);
                }
            },
        ),
    );
    passport.use(
        'register',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            async function (req, email, password, done) {
                try {
                    let existingUser = await User.findOne({email});
                    if (!existingUser) {
                        let user = new User({
                            email,
                            name: req.body.name,
                        });
                        user.password = user.encryptPassword(password);
                        let saved = await user.save();
                        if (saved) {
                            return done(null, user.toWeb());
                        }
                    }
                    return done(null, false);
                } catch (error) {
                    return done(error, false);
                }
            },
        ),
    );
    passport.use(
        'verify',
        new JwtStrategy(
            {
                secretOrKey: config.jwtSecret,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
            },
            async (req, payload, done) => {
                try {
                    let user = await User.findOne({_id: payload._id});
                    if (user) {
                        return done(null, user.toWeb());
                    }
                    return done(null, false);
                } catch (error) {
                    console.log(error);
                    return done(error, false);
                }
            },
        ),
    );
    return passport;
};
