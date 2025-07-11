// import crypto from 'crypto';
// import httpStatus from 'http-status';
// import AppError from '../../errors/AppError';
// import { TUser } from '../users/user.interface';
// import { createToken } from './auth.util';
// import config from '../../config';
// import { UserModel } from '../users/user.model';
// // import { sendEmail } from '../../utils/sendEmail';

// const signup = async (payload: TUser) => {
//   const existingUser = await UserModel.findOne({
//     $or: [{ email: payload.email }, { username: payload.username }],
//   });

//   if (existingUser) {
//     throw new AppError(
//       httpStatus.CONFLICT,
//       'Admin user with this email or username already exists',
//     );
//   }

//   // Generate email verification token (expires in 1 day)
//   const verificationToken = crypto.randomBytes(32).toString('hex');
//   const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

//   const newUser = new UserModel({
//     username: payload.username,
//     email: payload.email,
//     password: payload.password,
//     isVerified: false,
//     verificationToken,
//     verificationTokenExpiry,
//   });

//   await newUser.save();

//   // Send verification email
//   const verifyUrl = `${config.client_base_url}/verify-email?token=${verificationToken}`;
//   const message = `
//     <p>Please verify your email by clicking the link below:</p>
//     <a href="${verifyUrl}">${verifyUrl}</a>
//     <p>This link expires in 24 hours.</p>
//   `;

//   // await sendEmail(newUser.email, 'Verify Your Email', message);

//   newUser.password = ''; // hide password
//   // newUser.verificationToken = undefined;
//   // newUser.verificationTokenExpiry = undefined;

//   return newUser;
// };

// const signin = async (payload: TUser) => {
//   const adminUser = await UserModel.findOne({ email: payload.email }).select(
//     '+password +isVerified',
//   );

//   if (!adminUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
//   }
//   if (!adminUser.isVerified) {
//     throw new AppError(httpStatus.FORBIDDEN, 'Email not verified');
//   }
//   if (adminUser.role !== 'admin' && adminUser.role !== 'superadmin') {
//     throw new AppError(httpStatus.FORBIDDEN, 'Access Denied');
//   }

//   const isPasswordMatched = await AdminUser.isPasswordMatched(
//     payload.password,
//     adminUser.password,
//   );
//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.FORBIDDEN, 'Incorrect Password');
//   }

//   const jwtPayload = {
//     email: adminUser.email,
//     role: adminUser.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string,
//   );

//   const refreshToken = createToken(
//     jwtPayload,
//     config.jwt_refresh_secret as string,
//     config.jwt_refresh_expires_in as string,
//   );

//   return {
//     accessToken,
//     refreshToken,
//     user: adminUser,
//   };
// };

// const verifyEmail = async (token: string) => {
//   if (!token) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Verification token is required');
//   }

//   const user = await AdminUser.findOne({
//     verificationToken: token,
//     verificationTokenExpiry: { $gt: new Date() },
//   });

//   if (!user) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired verification token');
//   }

//   user.isVerified = true;
//   user.verificationToken = undefined;
//   user.verificationTokenExpiry = undefined;

//   await user.save();
// };

// const forgotPassword = async (email: string) => {
//   if (!email) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Email is required');
//   }

//   const user = await AdminUser.findOne({ email });
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (!user.isVerified) {
//     throw new AppError(httpStatus.FORBIDDEN, 'Email not verified');
//   }

//   const resetToken = crypto.randomBytes(32).toString('hex');
//   const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

//   user.passwordResetToken = resetToken;
//   user.passwordResetTokenExpiry = resetTokenExpiry;

//   await user.save();

//   const resetUrl = `${config.client_base_url}/reset-password?token=${resetToken}`;
//   const message = `
//     <p>You requested a password reset. Click the link below to reset your password:</p>
//     <a href="${resetUrl}">${resetUrl}</a>
//     <p>If you did not request this, please ignore this email.</p>
//   `;

//   await sendEmail(user.email, 'Password Reset Request', message);
// };

// export const AuthServices = {
//   signup,
//   signin,
//   verifyEmail,
//   forgotPassword,
//   adminLogin: signin,      // reuse signin for adminLogin
//   superAdminLogin: signin, // reuse signin for superAdminLogin (check role inside signin)
//   createAdminUser: signup, // reuse signup for createAdminUser
// };
