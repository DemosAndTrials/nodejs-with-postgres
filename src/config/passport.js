// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// load up the user model
import UserModel from '../controllers/user/model';

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        console.log('serializeUser');
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        console.log('deserializeUser');
        //User.findById(id, function(err, user) {
        //done(err, user);
        //});
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
                    if (user !== undefined) {
                        bcrypt.compare(password, user.password, function (err, check) {
                            if (err) {
                                console.log('Error while checking password: ' + err);
                                return done();
                            } else if (check) {
                                console.log('check: ' + JSON.stringify(user));
                                return done(null, [{
                                    email: user.email,
                                    name: user.name
                                }]);
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