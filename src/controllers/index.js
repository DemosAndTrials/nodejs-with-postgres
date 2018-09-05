import { Router } from 'express';
import { AccountRoutes } from './account';

const routes = new Router();

routes.use('/account', AccountRoutes);

export default routes;