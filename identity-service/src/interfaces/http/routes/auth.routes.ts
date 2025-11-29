import { Router } from "express";
import { createAuthController } from "../compositions/auth.composition";
import { authMiddleware } from "../middlewares";
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
		"/refresh",
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
	router.post("/google", authController.googleAuth);
	router.post("/add-interests", authController.addInterests);

	router.use(authMiddleware());
	router.post("/logout", authController.logout);
	router.get("/me", authController.me);
	return router;
}
