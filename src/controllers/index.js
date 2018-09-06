import { Router } from 'express';
import { AccountRoutes } from './account';
import { HomeRoutes } from './home';

const routes = new Router();

routes.use('/account', AccountRoutes);
routes.use('/', HomeRoutes);

export default routes;