import { Router } from 'express';
import * as UserController from './controller';
import { isAuthenticated } from '../../config/passport';

const routes = new Router();

routes.get('/login', isAuthenticated, UserController.loginPage);
routes.post('/login', isAuthenticated, UserController.login, UserController.finalizeLogin);
routes.get('/logout', UserController.logoutPage);
routes.get('/signup', isAuthenticated, UserController.signupPage);
routes.post('/signup', isAuthenticated, UserController.signupPage);
routes.get('/profile', isAuthenticated, UserController.profilePage);
// test
routes.get('/get', UserController.getUsers);
routes.post('/create', UserController.signupPage);

export default routes;