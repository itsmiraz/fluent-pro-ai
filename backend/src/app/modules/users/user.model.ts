import mongoose, { Schema } from 'mongoose';
import { AdminUserModel, TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcryptjs';

const AdminUserSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin', 'moderator'],
      default: 'admin',
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  },
);

//post save middleware /hook
AdminUserSchema.post('save', function (doc, next) {
  doc.password = '';

  next();
});
// Pre save middleware /hook
AdminUserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; //document
  // Hashing user password and save to the db
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});
AdminUserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  HashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, HashedPassword);
};


export const AdminUser = mongoose.model<TUser,AdminUserModel>('AdminUser', AdminUserSchema);
