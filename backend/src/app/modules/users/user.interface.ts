import { Model } from "mongoose";
/* eslint-disable no-unused-vars */
export type TUserRole= 'admin' | 'superadmin' | 'moderator';
export type TUser = {
  username: string;
  email: string;
  password: string; // hashed password
  role: 'admin' | 'superadmin' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
};

export interface AdminUserModel extends Model<TUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  
}