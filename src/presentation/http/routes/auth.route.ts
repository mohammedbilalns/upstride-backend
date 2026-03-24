import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants";
import {
	AuthController,
	LogoutController,
	PasswordResetController,
} from "../controllers";
import {
	csrfProtection,
	ensureCsrfSessionId,
	validate,
	verifySession,
} from "../middlewares";
import {
	googleLoginBodySchema,
	linkedinLoginBodySchema,
	loginBodySchema,
	passwordResetBodySchema,
	registerBodySchema,
	resendOtpBodySchema,
	saveInterestsBodySchema,
	updatePasswordBodySchema,
	verifyOtpBodySchema,
} from "../validators/auth";
import { revokeSessionBodySchema } from "../validators/auth/revocation.validator";

const router = Router();
const authController = container.get(AuthController);
const passwordResetController = container.get(PasswordResetController);
const logoutController = container.get(LogoutController);

router.post(
	ROUTES.AUTH.LOGIN,
	ensureCsrfSessionId,
	validate({ body: loginBodySchema }),
	authController.login,
);

router.post(
	ROUTES.AUTH.GOOGLE,
	ensureCsrfSessionId,
	validate({ body: googleLoginBodySchema }),
	authController.loginWithGoogle,
);

router.post(
	ROUTES.AUTH.LINKEDIN,
	ensureCsrfSessionId,
	validate({ body: linkedinLoginBodySchema }),
	authController.loginWithLinkedIn,
);

router.post(
	ROUTES.AUTH.REGISTER,
	validate({ body: registerBodySchema }),
	authController.register,
);

router.post(
	ROUTES.AUTH.VERIFY_REGISTER_OTP,
	validate({ body: verifyOtpBodySchema }),
	authController.verifyRegisterOtp,
);

router.post(
	ROUTES.AUTH.RESEND_REGISTER_OTP,
	validate({ body: resendOtpBodySchema }),
	authController.resendRegisterOtp,
);

router.get(ROUTES.AUTH.CSRF, ensureCsrfSessionId, authController.getCsrfToken);

router.post(ROUTES.AUTH.REFRESH, csrfProtection, authController.refreshSession);

router.post(
	ROUTES.AUTH.SAVE_INTERESTS,
	ensureCsrfSessionId,
	validate({ body: saveInterestsBodySchema }),
	authController.saveInterests,
);

router.post(
	ROUTES.AUTH.REQUEST_PASSWORD_RESET,
	validate({ body: passwordResetBodySchema }),
	passwordResetController.requestPasswordReset,
);

router.post(
	ROUTES.AUTH.VERIFY_RESET_PASSWORD_OTP,
	validate({ body: verifyOtpBodySchema }),
	passwordResetController.verifyResetPasswordOtp,
);

router.post(
	ROUTES.AUTH.RESEND_RESET_PASSWORD_OTP,
	validate({ body: resendOtpBodySchema }),
	passwordResetController.resendResetPasswordOtp,
);

router.post(
	ROUTES.AUTH.UPDATE_PASSWORD,
	validate({ body: updatePasswordBodySchema }),
	passwordResetController.updatePassword,
);

router.use(verifySession);

router.get(ROUTES.AUTH.ACTIVE_SESSIONS, logoutController.getActiveSessions);

router.post(ROUTES.AUTH.LOGOUT, logoutController.logout);

router.post(
	ROUTES.AUTH.REVOKE_SESSION,
	validate({ body: revokeSessionBodySchema }),
	logoutController.revokeSession,
);

router.post(
	ROUTES.AUTH.REVOKE_ALL_OTHER_SESSIONS,
	logoutController.revokeAllOtherSessions,
);
export { router as authRouter };
