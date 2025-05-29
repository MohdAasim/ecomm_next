import { User } from "../models/User";
import { Model } from "sequelize";

// Define the User attributes type
export interface UserAttributes {
  id?: number;
  email: string;
  otp?: string | null;
  otpExpiresAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for a User instance
export type UserInstance = Model<UserAttributes> & UserAttributes;

export const findUserByEmail = async (
  email: string,
): Promise<UserInstance | null> => {
  return (await User.findOne({ where: { email } })) as UserInstance | null;
};

export const createUser = async (email: string): Promise<UserInstance> => {
  return (await User.create({ email })) as UserInstance;
};

export const updateUserOTP = async (
  user: UserInstance,
  otp: string,
  otpExpiresAt: Date,
): Promise<UserInstance> => {
  return await user.update({ otp, otpExpiresAt });
};

export const clearUserOTP = async (
  user: UserInstance,
): Promise<UserInstance> => {
  return await user.update({ otp: null, otpExpiresAt: null });
};
