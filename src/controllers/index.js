import { Router } from 'express';
import { UserRoutes } from './user';
import { AccountRoutes } from './account';
import { HomeRoutes } from './home';

const routes = new Router();

routes.use('/user', UserRoutes);
routes.use('/account', AccountRoutes);
routes.use('/', HomeRoutes);

export default routes;