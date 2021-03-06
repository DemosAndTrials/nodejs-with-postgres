import { Router } from 'express';
import * as UserController from './controller';

const routes = new Router();

routes.get('/login', UserController.loginPage);
routes.post('/login', UserController.login, UserController.finalizeLogin);
routes.get('/logout', UserController.logoutPage);
routes.get('/signup', UserController.signupPage);
routes.post('/signup', UserController.signupPage);
routes.get('/profile', UserController.profilePage);
// test
routes.get('/get', UserController.getUsers);
routes.post('/create', UserController.signupPage);

export default routes;