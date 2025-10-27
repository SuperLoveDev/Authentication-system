import crypto from "crypto";
import { NextFunction, Response, Request } from "express";
import { ValidationError } from "../../../../packages/error-handler";
import redis from "../../../../packages/libs/Redis";
import { sendEmail } from "../../../../packages/sendMail";
import prisma from "../../../../packages/libs/Prisma";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateUserData = async (data: any) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new ValidationError("All fields are required");
  }

  if (emailRegex.test(email)) {
    throw new ValidationError("email format not valid");
  }
};

// OTP check
export const checkOtpRestriction = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError("Your email is locekd, please try again after 30m")
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many OTP request, please try again after an hour"
      )
    );
  }

  if (await redis.get(`otp_cooldown: ${email}`)) {
    return next(
      new ValidationError("Please wait a minute before request a new otp")
    );
  }
};

// OTP restrictions
export const trackOtpRestriction = async (
  email: string,
  next: NextFunction
) => {
  const otpRequestKey = `otp_request_count:${email}`;
  const otpRequest = await redis.incr(otpRequestKey);

  if (otpRequest === 1) {
    await redis.expire(otpRequestKey, 60);
  }

  if (otpRequest > 2) {
    await redis.set(`otp_spam_lock`, "locked", "EX", 3600);
    return next(
      new ValidationError("Too many OTP request, please try after an hour")
    );
  }
};

// Send otp
export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "verify your email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};

// verifying otp
export const otpVerification = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    return next(new ValidationError("invalid or expired otp"));
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  if (storedOtp !== otp) {
    if (failedAttempts > 2) {
      await redis.set(`otp_lock:${email}`, "lock", "EX", 1800);
      await redis.del(`otp:${email}`, failedAttemptsKey);
      return next(
        new ValidationError(
          "Your account is locked, please try again after 30m"
        )
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
    return next(
      new ValidationError(`Incorrect OTP ${2 - failedAttempts} attempts left`)
    );
  }

  await redis.del(`otp:${email}`, failedAttemptsKey);
};

// handle forgot user password
export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ValidationError("Email is required"));
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return next(new ValidationError("No account associated with this email"));
    }

    await checkOtpRestriction(email, next);
    await trackOtpRestriction(email, next);

    // generate and send otp
    await sendOtp(existingUser.name, email, "user-forgotpassword-mail");

    res
      .status(200)
      .json({ success: true, message: "OTP sent, Please verify your email" });
  } catch (error) {
    return next(error);
  }
};

export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(new ValidationError("Email and otp are required"));
    }

    await otpVerification(email, otp, email);

    res.status(200).json({
      message: "OTP verified. You can now reset your password ",
    });
  } catch (error) {
    return next(error);
  }
};
