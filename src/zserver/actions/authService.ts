"use server";

import * as userRepo from "../repositories/userRepository";
import { sendEmail } from "../utils/mailer";
import { generateToken } from "../utils/jwt.utils";
import { UserInstance } from "../repositories/userRepository";

/**
 * Generate a 6-digit OTP as a string.
 * @returns {string} The generated OTP.
 */
const generateOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Send an OTP to the user's email. Creates the user if not exists.
 * @param {string} email - The user's email address.
 * @returns {Promise<{ message: string }>} Message indicating OTP was sent.
 */
export const sendOTPService = async (
  email: string,
): Promise<{ message: string }> => {
  const otp = generateOTP();
  console.log("in here ");

  const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

  let user: UserInstance | null = await userRepo.findUserByEmail(email);
  if (!user) {
    user = await userRepo.createUser(email);
  }

  await userRepo.updateUserOTP(user, otp, otpExpiresAt);

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 2 minutes.`,
  });

  return { message: "OTP sent to email" };
};

/**
 * Verify the OTP for a user and return a JWT token if valid.
 * @param {string} email - The user's email address.
 * @param {string} otp - The OTP to verify.
 * @returns {Promise<{ message: string; token: string; userId: number }>} Message, JWT token, and userId if successful.
 * @throws {Error} If OTP is invalid or expired.
 */
export const verifyOTPService = async (
  email: string,
  otp: string,
): Promise<{ message: string; token: string; userId: number }> => {
  const user = await userRepo.findUserByEmail(email);
  if (!user || user.otp !== otp || new Date() > user.otpExpiresAt!) {
    throw new Error("Invalid or expired OTP");
  }

  await userRepo.clearUserOTP(user);

  const token = generateToken({ id: user.id, email: user.email });

  return { message: "Login successful", token, userId: user.id! };
};
