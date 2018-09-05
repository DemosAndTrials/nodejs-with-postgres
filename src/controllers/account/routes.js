import { Router } from 'express';
import * as AccountController from './controller';

const routes = new Router();

routes.get('/get', AccountController.getAccounts);
routes.post('/create', AccountController.createAccount);

export default routes;