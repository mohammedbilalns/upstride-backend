import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants/route-paths";
import {
	AuthController,
	LogoutController,
	PasswordResetController,
} from "../controllers";
import { verifySession } from "../middlewares";
import { validate } from "../middlewares/validator.middleware";
import {
	loginBodySchema,
	passwordResetBodySchema,
	registerBodySchema,
	resendOtpBodySchema,
	saveInterestsBodySchema,
	verifyOtpBodySchema,
} from "../validators/auth";
import { revokeSessionBodySchema } from "../validators/auth/revokation.validator";
import { updatePasswordBodySchema } from "../validators/auth/update-password.validator";

const router = Router();
const authController = container.get(AuthController);
const passwordResetController = container.get(PasswordResetController);
const logoutController = container.get(LogoutController);

router.post(
	ROUTES.AUTH.LOGIN,
	validate({ body: loginBodySchema }),
	authController.login,
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

router.post(ROUTES.AUTH.REFRESH, authController.refreshSession);

router.post(
	ROUTES.AUTH.SAVE_INTERESTS,
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
	verifySession,
	validate({ body: revokeSessionBodySchema }),
	logoutController.revokeSession,
);

router.post(
	ROUTES.AUTH.REVOKE_ALL_OTHER_SESSIONS,
	verifySession,
	logoutController.revokeAllOtherSessions,
);
export { router as authRouter };
