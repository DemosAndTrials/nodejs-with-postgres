import bodyParser from 'body-parser';
import validator from 'express-validator';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
require('../config/passport')(passport); // pass passport for configuration

export default app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(validator());

    app.use(cookieParser()); // read cookies (needed for auth)
    // required for passport
    app.use(session({ secret: 'sfmc-examples' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session
};