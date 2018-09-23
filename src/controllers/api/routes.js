import { Router } from 'express';
import * as ApiController from './controller';

const routes = new Router();

routes.get('/', ApiController.indexPage);
routes.get('/sdk', ApiController.indexPage);
routes.get('/rest', ApiController.indexPage);
routes.get('/soap', ApiController.indexPage);

export default routes;