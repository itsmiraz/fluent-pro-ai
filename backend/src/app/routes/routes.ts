import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { ChatRoutes } from '../modules/chat/chat.routes';

const router = Router();

const ModuleRoutes = [
  
  {
    path: '/auth',
    route: AuthRoutes,
  },
  
  {
    path: '/chat',
    route: ChatRoutes,
  },
 
];

ModuleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
