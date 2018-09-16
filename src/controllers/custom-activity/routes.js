import { Router } from 'express';
import * as CustomActivityController from './controller';

const routes = new Router();

routes.get('/', CustomActivityController.indexPage);
routes.get('/index', CustomActivityController.indexPage);
routes.get('/setup', CustomActivityController.setupPage);
routes.get('/create', CustomActivityController.createPage);
routes.post('/create', CustomActivityController.createConfig);
routes.get('/list', CustomActivityController.listPage);

routes.get('/get', CustomActivityController.getAccounts);

export default routes;