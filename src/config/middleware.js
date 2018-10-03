import bodyParser from 'body-parser';
import validator from 'express-validator';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
require('../config/passport').config(passport); // pass passport for configuration
require('dotenv').load();

export default app => {
    // load environment variables for dev mode
    if (process.env.NODE_ENV !== 'production') {
        require('dotenv').load();
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(validator());

    app.use(cookieParser()); // read cookies (needed for auth)
    // required for passport
    app.use(session({
        secret: 'sfmc-examples',
        resave: false,
        saveUninitialized: true
    })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session
};