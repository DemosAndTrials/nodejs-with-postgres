import { Router } from 'express';
import * as CustomActivityController from './controller';

const routes = new Router();

routes.get('/', CustomActivityController.indexPage);
routes.get('/index', CustomActivityController.indexPage);
routes.get('/setup', CustomActivityController.setupPage);
routes.get('/create', CustomActivityController.createPage);
routes.get('/create/:id', CustomActivityController.editPage);
routes.post('/create', CustomActivityController.createConfig);
routes.post('/create/:id', CustomActivityController.createConfig);
routes.post('/delete/:id', CustomActivityController.deleteConfig);
routes.get('/list', CustomActivityController.listPage);
routes.post('/:id/config.json', CustomActivityController.getJson);

export default routes;