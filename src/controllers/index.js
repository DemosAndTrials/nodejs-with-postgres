import { Router } from 'express';
import { UserRoutes } from './user';
import { AdminRoutes } from './admin';
import { AccountRoutes } from './account';
import { HomeRoutes } from './home';
import { isAuthenticated } from '../config/passport';
import { CustomActivityRoutes } from './custom-activity';
import { ApiRoutes } from './api';

const routes = new Router();

// limited access
routes.use('/user', isAuthenticated, UserRoutes);
routes.use('/admin', isAuthenticated, AdminRoutes);
// public access
routes.use('/account', AccountRoutes);
routes.use('/', HomeRoutes);
routes.use('/ca', CustomActivityRoutes);
routes.use('/api', ApiRoutes);

export default routes;