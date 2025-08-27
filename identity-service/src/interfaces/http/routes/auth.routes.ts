import { Router } from "express";
import { createAuthController } from "../compositions/auth.composition";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";

export function createAuthRouter() {
  const router = Router();
  const authController = createAuthController();

  router.post("/login", authController.login);
  router.post(
    "/register",
    rateLimiter(5, 60, ["ip", "route"]),
    authController.register,
  );
  router.post("/google-auth", authController.googleAuth);
  router.post(
    "/verify-otp",
    rateLimiter(10, 60, ["ip", "route"]),
    authController.verifyOtp,
  );

  router.post(
    "/resend-otp",
    rateLimiter(5, 60, ["ip", "route"]),
    authController.resendOtp,
  );
  router.post(
    "/refresh-token",
    rateLimiter(5, 60, ["ip", "route"]),
    authController.refreshToken,
  );
  router.post(
    "/reset-password",
    rateLimiter(5, 60, ["ip", "route"]),
    authController.reset,
  );
  router.post(
    "/verify-reset-otp",
    rateLimiter(5, 60, ["ip", "route"]),
    authController.verifyResetOtp,
  );
  router.post("/resend-reset-otp", authController.resendResetOtp);
  router.post(
    "/update-password",
    rateLimiter(5, 60, ["ip", "route"]),
    authController.updatePassword,
  );
  router.post("/logout", authController.logout);
  return router;
}
