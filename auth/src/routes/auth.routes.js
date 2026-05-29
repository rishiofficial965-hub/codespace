import { Router } from "express";
import passport from "passport";
import {
  registerHandler,
  loginHandler,
  googleCallbackHandler,
  verifyOTP,
  sendOTP,
  forgetPassword,
  verifyResetOtp
} from "../controllers/auth.controller.js";
import { validationRegisterUser, validationLoginUser } from "../validator/auth.validator.js";

const router = Router();

router.post("/register", validationRegisterUser, registerHandler);
router.post("/login", validationLoginUser, loginHandler);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  googleCallbackHandler,
);

router.post("/verify-otp", verifyOTP);
router.post("/send-otp", sendOTP);

router.post("/forget-password", forgetPassword);
router.post("/verify-reset-otp", verifyResetOtp);

export default router;