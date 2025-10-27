import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestriction,
  sendOtp,
  trackOtpRestriction,
  validateUserData,
} from "../utils/authHelper";
import prisma from "../../../../packages/libs/Prisma";
import { ValidationError } from "../../../../packages/error-handler";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateUserData(req.body);
    const { name, email } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError("A user already exist with this email"));
    }

    // check the otp and sending an email
    await checkOtpRestriction(email, next);
    await trackOtpRestriction(email, next);
    await sendOtp(name, email, "user-activation-mail");

    res.status(200).json({
      message: "OTP sent to email, Please check your email",
    });
  } catch (error) {
    return next(error);
  }
};

export const verfiyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, otp } = req.body;
    if (!name || !email || !password || !otp) {
      return next(new ValidationError("All fields are required"));
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError("User already exist with this email"));
    }

    // otp verification
    await otpVerification();
  } catch (error) {
    return next(error);
  }
};
