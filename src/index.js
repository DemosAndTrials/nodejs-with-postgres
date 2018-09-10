import express from 'express';
import path from 'path';

import { createTables } from './config/postgres';
import middlewaresConfig from './config/middleware';;
import ApiRoutes from './controllers';
import  HomeRoutes from './controllers';

var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
require('./config/passport')(passport); // pass passport for configuration

const app = express();
app.use(cookieParser()); // read cookies (needed for auth)
// required for passport
app.use(session({ secret: 'sfmc-examples' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
/**
 * MIDDLEWARES
 */

middlewaresConfig(app);

/**
 * VIEW ENGINE
 */
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

/**
 * API ROUTES
 */
// serve static files
app.use(express.static(path.join(__dirname, "static")));
// controllers
app.use('/', HomeRoutes);
app.use('/api', ApiRoutes);
// errors
// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"
app.use(function (req, res, next) {
    res.status(404);
    
    res.format({
        html: function () {
            res.render('pages/404', {
                url: req.url
            })
        },
        json: function () {
            res.json({
                error: 'Not found'
            })
        },
        default: function () {
            res.type('txt').send('Not found')
        }
    })
});

/**
 * POSTGRES
 */

(async () => {
    await createTables();
})();


const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(`Server Running on port: ${PORT}`);
    }
});