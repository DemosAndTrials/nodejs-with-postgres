import { Router } from 'express';
import * as ApiController from './controller';

const routes = new Router();

routes.get('/', ApiController.indexPage);
routes.get('/sdk', ApiController.sdkPage);
routes.get('/rest', ApiController.restPage);
routes.get('/soap', ApiController.soapPage);

routes.get('/sdk/de', ApiController.deFoldersPage);
routes.get('/sdk/de-folder/:id', ApiController.deFolderPage);
routes.post('/sdk/de-delete/:id', ApiController.deleteDE);
routes.post('/sdk/de-folder/', ApiController.createFolder);
routes.get('/sdk/de-create/:id', ApiController.createDEPage);
routes.get('/sdk/de-details/:id', ApiController.detailsDEPage);
routes.post('/sdk/row-delete/:name', ApiController.deleteDERow);

export default routes;