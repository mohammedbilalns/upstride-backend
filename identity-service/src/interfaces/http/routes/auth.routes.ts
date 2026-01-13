import { Router } from "express";
import { createAuthController } from "../compositions/auth.composition";
import { authMiddleware } from "../middlewares";
import { rateLimiter } from "../middlewares/rate-limiter.middleware";
import { createRegistrationController } from "../compositions/registration.composition";
import { createPasswordResetController } from "../compositions/passwordReset.composition";

export function createAuthRouter() {
	const router = Router();
	const authController = createAuthController();
	const registrationController = createRegistrationController();
	const passwordResetController = createPasswordResetController();

	router.post("/login", authController.login);
	router.post(
		"/register",
		rateLimiter(5, 60, ["ip", "route"]),
		registrationController.register,
	);
	router.post(
		"/verify-otp",
		rateLimiter(10, 60, ["ip", "route"]),
		registrationController.verifyOtp,
	);

	router.post(
		"/resend-otp",
		rateLimiter(5, 60, ["ip", "route"]),
		registrationController.resendOtp,
	);
	router.post(
		"/refresh",
		rateLimiter(5, 60, ["ip", "route"]),
		authController.refreshToken,
	);
	router.post(
		"/reset-password",
		rateLimiter(5, 60, ["ip", "route"]),
		passwordResetController.reset,
	);
	router.post(
		"/verify-reset-otp",
		rateLimiter(5, 60, ["ip", "route"]),
		passwordResetController.verifyResetOtp,
	);
	router.post("/resend-reset-otp", passwordResetController.resendResetOtp);
	router.post(
		"/update-password",
		rateLimiter(5, 60, ["ip", "route"]),
		passwordResetController.updatePassword,
	);
	router.post("/google", authController.googleAuth);
	router.post("/add-interests", registrationController.addInterests);

	router.use(authMiddleware());
	router.post("/logout", authController.logout);
	router.get("/me", authController.me);
	return router;
}
