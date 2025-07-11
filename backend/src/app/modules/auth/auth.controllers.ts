import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.services';

const adminLogin = catchAsync(async (req, res) => {
  const result = await AuthServices.adminLogin(req.body);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: 'Admin login successful',
  });
});

const superAdminLogin = catchAsync(async (req, res) => {
  const result = await AuthServices.superAdminLogin(req.body);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: 'Superadmin login successful',
  });
});

const createAdminUser = catchAsync(async (req, res) => {
  const result = await AuthServices.createAdminUser(req.body);

  sendResponse(res, {
    data: result,
    statusCode: 201,
    success: true,
    message: 'Admin created successfully',
  });
});

export const AuthControllers = {
  adminLogin,
  superAdminLogin,
  createAdminUser,
};
