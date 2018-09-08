import { Router } from 'express';
import * as UserController from './controller';

const routes = new Router();

routes.get('/login', UserController.loginPage);
routes.get('/signup', UserController.signupPage);
routes.post('/signup', UserController.createUser);
routes.get('/profile', UserController.profilePage);
routes.get('/get', UserController.getUsers);
routes.post('/create', UserController.createUser);

export default routes;