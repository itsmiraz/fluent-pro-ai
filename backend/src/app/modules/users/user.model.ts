import mongoose, { Schema, model } from 'mongoose';
import { TUser } from './user.interface';

const UserSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    learningGoal: {
      type: String,
      enum: ['conversational', 'professional', 'sales'],
      required: true,
    },
    currentDay: {
      type: Number,
      default: 1,
    },
    isVerified: {
      type: Boolean,
    },
    dailyProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DailyProgress',
      },
    ],

    streak: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // includes createdAt and updatedAt
  }
);

export const UserModel = model<TUser>('User', UserSchema);
