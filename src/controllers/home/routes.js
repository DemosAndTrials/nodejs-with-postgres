import { Router } from 'express';
import * as HomeController from './controller';

const routes = new Router();

routes.get('/', HomeController.homePage);
routes.get('/home', HomeController.homePage);
routes.get('/about', HomeController.aboutPage);

export default routes;