import { Router } from 'express';
import * as UserController from './controller';
var passport = require('passport');

const routes = new Router();

routes.get('/login', UserController.loginPage);
routes.post('/login', UserController.authenticate, UserController.finalizeLogin);
routes.get('/logout', UserController.logoutPage);
routes.get('/signup', UserController.signupPage);
routes.post('/signup', UserController.signupPage);
routes.get('/profile', UserController.profilePage);
routes.get('/get', UserController.getUsers);
routes.post('/create', UserController.signupPage);

// process the signup form
routes.post('/login5',
// wrap passport.authenticate call in a middleware function
function (req, res, next) {
  // call passport authentication passing the "local" strategy name and a callback function
  passport.authenticate('local-signup', function (error, user, info) {
    // this will execute in any case, even if a passport strategy will find an error
    // log everything to console
    console.log(error);
    console.log(user);
    console.log(info);

    if (error) {
      res.status(401).send(error);
    } else if (!user) {
      res.status(401).send(info);
    } else {
      next();
    }

    res.status(401).send(info);
  })(req, res, next);
},

// function to call once successfully authenticated
function (req, res) {
  res.status(200).send('logged in!');
});

export default routes;