import { Router } from 'express';
import * as AdminController from './controller';

const routes = new Router();

routes.get('/', AdminController.indexPage);
routes.get('/index', AdminController.indexPage);
routes.get('/users', AdminController.usersPage);
routes.get('/getUsers', AdminController.getUsers);
routes.post('/create', AdminController.createAccount);

export default routes;