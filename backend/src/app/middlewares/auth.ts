import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { AdminUser } from '../modules/users/user.model';
import { TUserRole } from '../modules/users/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized 1');
    }
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized 2');
    }

    const { role, email, } = decoded;

    const user = await AdminUser.findOne({email});
    if (!user) {
      throw new AppError(404, 'User Not Found');
    }

    // const isUserDeleted = user.isDeleted;

    // if (isUserDeleted) {
    //   throw new AppError(400, 'User has been Deleted');
    // }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized -3');
    }
    req.user = decoded 
    next();
  });
};

export default auth;
