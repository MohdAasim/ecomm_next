"use server";

import * as userRepo from "../repositories/userRepository";
import { sendEmail } from "@/utils/mailer";
import { generateToken } from "@/utils/jwt.utils";
import { UserInstance } from "../repositories/userRepository";
import { validate } from "../middlewares/validateRequest";
import { logger } from "@/utils/logger";

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
  // Validate input
  const { valid, message } = validate("sendOTP", { email });
  if (!valid) {
    logger.warn(`Validation failed for sendOTP: ${message}`);
    throw new Error(message);
  }

  const otp = generateOTP();
  logger.info(`Generated OTP for ${email}`);

  const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

  let user: UserInstance | null = await userRepo.findUserByEmail(email);
  if (!user) {
    user = await userRepo.createUser(email);
    logger.info(`Created new user for email: ${email}`);
  }

  await userRepo.updateUserOTP(user, otp, otpExpiresAt);

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 2 minutes.`,
  });

  logger.info(`OTP sent to email: ${email}`);

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
  // Validate input
  const { valid, message } = validate("verifyOTP", { email, otp });
  if (!valid) throw new Error(message);

  const user = await userRepo.findUserByEmail(email);
  if (!user || user.otp !== otp || new Date() > user.otpExpiresAt!) {
    throw new Error("Invalid or expired OTP");
  }

  await userRepo.clearUserOTP(user);

  const token = generateToken({ id: user.id, email: user.email });

  return { message: "Login successful", token, userId: user.id! };
};
