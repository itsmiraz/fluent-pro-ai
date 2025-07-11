import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from '../users/user.interface';
import { AdminUser } from '../users/user.model';
import config from '../../config';
import { createToken } from './auth.util';

const adminLogin = async (payload: TUser) => {
  const adminUser = await AdminUser.findOne({ email: payload.email }).select(
    '+password',
  );

  if (!adminUser) {
    throw new AppError(404, 'User Not Found');
  }
  if (adminUser.role !== 'admin') {
    throw new AppError(403, 'Access Denied');
  }

  const isPasswordMatched = await AdminUser.isPasswordMatched(
    payload.password,
    adminUser.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect Password');
  }

  const jwtPayload = {
    email: adminUser.email,
    role: adminUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: adminUser,
  };
};

const superAdminLogin = async (payload: TUser) => {
  const adminUser = await AdminUser.findOne({ email: payload.email }).select(
    '+password',
  );

  if (!adminUser) {
    throw new AppError(404, 'User Not Found');
  }
  if (adminUser.role !== 'superadmin') {
    throw new AppError(403, 'Access Denied');
  }

  const isPasswordMatched = await AdminUser.isPasswordMatched(
    payload.password,
    adminUser.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect Password');
  }

  const jwtPayload = {
    email: adminUser.email,
    role: adminUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: adminUser,
  };
};

const createAdminUser = async (payload: TUser) => {
  // Check if a user with this email or username already exists
  const existingUser = await AdminUser.findOne({
    $or: [{ email: payload.email }, { username: payload.username }],
  });

  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Admin user with this email or username already exists',
    );
  }

  // Create new admin user with role 'admin' by default or use provided role if valid
  const newAdmin = new AdminUser({
    username: payload.username,
    email: payload.email,
    password: payload.password,
    role: 'admin',
  });

  await newAdmin.save();

  // Remove password before returning
  newAdmin.password = '';

  return newAdmin;
};
export const AuthServices = {
  superAdminLogin,
  adminLogin,
  createAdminUser
};
