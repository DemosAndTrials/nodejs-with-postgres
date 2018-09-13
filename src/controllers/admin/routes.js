import { Router } from 'express';
import * as AdminController from './controller';

const routes = new Router();

routes.get('/get', AdminController.getAccounts);
routes.post('/create', AdminController.createAccount);

export default routes;