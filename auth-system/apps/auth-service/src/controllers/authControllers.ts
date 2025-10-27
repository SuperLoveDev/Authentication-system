import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestriction,
  handleForgotPassword,
  otpVerification,
  sendOtp,
  trackOtpRestriction,
  validateUserData,
  verifyForgotPasswordOtp,
} from "../utils/authHelper";
import prisma from "../../../../packages/libs/Prisma";
import { AuthError, ValidationError } from "../../../../packages/error-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookie";

// register user
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

// verify user
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
    await otpVerification(email, otp, next);

    // hashed the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json({
      success: true,
      message: "User created succesfully",
    });
  } catch (error) {
    return next(error);
  }
};

// login user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and password are required"));
    }

    // verifying the user email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AuthError("User does not exist"));
    }

    // verifying the user password
    const isMatching = await bcrypt.compare(password, user.password);
    if (!isMatching) {
      return next(new ValidationError("Invalid email or password"));
    }

    // providing an access and refresh token to the user
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    // storing the access and refesh token in an httponly
    setCookie(res, "access-token", accessToken);
    setCookie(res, "refresh-token", refreshToken);

    res.status(200).json({
      message: "Login successfully",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

// export const refreshAccessToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const refreshToken = req.cookies;
//     if (!refreshToken) {
//       return next(new ValidationError("No refresh token "));
//     }

//     // generating new access token
//     const newAccessToken = jwt.verify(
//       refreshToken,
//       process.env.REFESH_ACCESS_TOKEN as string
//     );
//   } catch (error) {
//     return next(error);
//   }
// };

// user forgot password
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgotPassword(req, res, next);
};

//verify forgot pâssword otp
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgotPasswordOtp(req, res, next);
};

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return next(new ValidationError("Email and password are required"));
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new ValidationError("No user found with this email"));
    }

    // comparing the password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return next(
        new ValidationError("The password can not be the same as the old one")
      );
    }

    //hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //updating the user password in
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      messsage: "password reset succesfully",
    });
  } catch (error) {
    return next(error);
  }
};
