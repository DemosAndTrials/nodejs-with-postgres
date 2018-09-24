import { Router } from 'express';
import * as ApiController from './controller';

const routes = new Router();

routes.get('/', ApiController.indexPage);
routes.get('/sdk', ApiController.sdkPage);
routes.get('/rest', ApiController.restPage);
routes.get('/soap', ApiController.soapPage);

routes.get('/sdk/de', ApiController.deFoldersPage);

export default routes;