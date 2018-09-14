// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
import bcryptjs from 'bcryptjs';
// load up the user model
import UserModel from '../controllers/user/model';

// expose this function to our app using module.exports
const config = (passport) => {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, username, password, done) => {
            loginAttempt();
            async function loginAttempt() {
                try {
                    const user = await UserModel.getUser(username);
                    // TODO get role
                    if (user !== undefined) {
                        bcryptjs.compare(password, user.password, function (err, check) {
                            if (err) {
                                console.log('Error while checking password: ' + err);
                                return done();
                            } else if (check) {
                                return done(null, {
                                    email: user.email,
                                    name: user.name
                                });
                            } else {
                                console.log('Incorrect login details.');
                                req.flash('danger', "Oops. Incorrect login details.");
                                return done(null, false);
                            }
                        });
                    } else {
                        console.log("no such user.");
                        return done(null, false);
                    }
                } catch (e) {
                    throw (e);
                }
            };
        }
    ))
};

/**
 * 
 */
const isAuthenticated = (req, res, next) => {
    // do any checks you want to in here
    console.log('isAuthenticated: ' + JSON.stringify(req.user));
    console.log('request originalUrl: ' + req.originalUrl);
    //console.log('request baseUrl: ' + req.baseUrl);
    //console.log('request url: ' + req.url);
    //user: { email: 'm01@mail.com', name: 'Ros01' }

    if (req.isAuthenticated()) {
        if (notForAuthRoutes.includes(req.originalUrl)) {
            console.log('notForAuthRoutes: ' + req.url);
            return res.redirect('/user/profile');
        }
    } else {
        if (authRoutes.includes(req.originalUrl)) {
            // only authenticated users can access this url
            console.log('authRoutes: ' + req.url);
            return res.redirect('/user/login'); // TODO pass url?
        }
    }
    return next();
}

/**
 * Routes allowed for authenticated users only
 */
const authRoutes = [
    '/user/profile',
    '/admin/',
    '_name_3',
    '_name_4'
]

/**
 * Routes restricted for authenticated users
 */
const notForAuthRoutes = [
    '/user/signup',
    '/user/login',
    '_name_3',
    '_name_4'
]

export {
    config,
    isAuthenticated
}