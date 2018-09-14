import { Router } from 'express';
import { UserRoutes } from './user';
import { AdminRoutes } from './admin';
import { AccountRoutes } from './account';
import { HomeRoutes } from './home';
import { isAuthenticated } from '../config/passport';

const routes = new Router();

routes.use('/user', UserRoutes);
routes.use('/admin', isAuthenticated, AdminRoutes);
routes.use('/account', AccountRoutes);
routes.use('/', HomeRoutes);

export default routes;