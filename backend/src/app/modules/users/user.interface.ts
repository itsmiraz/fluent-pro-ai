import { Model, ObjectId } from 'mongoose';
/* eslint-disable no-unused-vars */
export type LearningGoal = 'conversational' | 'professional' | 'sales';

export type DailyChallengeProgress = {
  date: string; // ISO string
  vocabCompleted: boolean;
  conversationCompleted: boolean;
  grammarCompleted: boolean;
  pronunciationCompleted: boolean;
};

export type TUser = {
  username: string;
  email: string;
  password: string; // hashed

  learningGoal: LearningGoal;
  currentDay: number;
  dailyProgress: ObjectId[];
  isVerified: boolean;
  streak: number;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface AdminUserModel extends Model<TUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
