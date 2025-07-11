import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';

const router = Router();

const ModuleRoutes = [
  
  {
    path: '/auth',
    route: AuthRoutes,
  },
 
];

ModuleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
