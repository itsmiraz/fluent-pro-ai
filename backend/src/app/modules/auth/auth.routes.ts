import express from 'express';
// import { AuthControllers } from './auth.controllers';
// import auth from '../../middlewares/auth';

const router = express.Router();

// router.post('/admin/login', AuthControllers.adminLogin);
// router.post('/superadmin/login', AuthControllers.superAdminLogin);
// router.post(
//   '/admin/create',
//   auth('superadmin'),
//   AuthControllers.createAdminUser,
// );

export const AuthRoutes = router;
