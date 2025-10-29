import express, { Router } from "express";
import {
  loginUser,
  resetUserPassword,
  userForgotPassword,
  userRegistration,
  verfiyUser,
  verifyUserForgotPassword,
} from "../controllers/authControllers";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verfiyUser);
router.post("/login-user", loginUser);
router.post("/user-forgot-password", userForgotPassword);
router.post("/verify-user-forgot-password", verifyUserForgotPassword);
router.post("/reset-user-password", resetUserPassword);

export default router;
