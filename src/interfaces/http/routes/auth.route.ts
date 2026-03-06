import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants/route-paths";
import {
	AuthController,
	LogoutController,
	PasswordResetController,
	ProfileController,
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
} from "../validators";
import { changePasswordBodySchema } from "../validators/change-password.schema";
import { updateProfileBodySchema } from "../validators/profile.validator";
import { revokeSessionBodySchema } from "../validators/revokation.schema";

const router = Router();
const authController = container.get(AuthController);
const passwordResetController = container.get(PasswordResetController);
const logoutController = container.get(LogoutController);
const profileController = container.get(ProfileController);

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
	ROUTES.AUTH.CHANGE_PASSWORD,
	validate({ body: changePasswordBodySchema }),
	passwordResetController.changePassword,
);

router.use(verifySession);

router.get(ROUTES.AUTH.ME, authController.getMe);
router.get(ROUTES.AUTH.PROFILE, profileController.getProfile);
router.put(
	ROUTES.AUTH.PROFILE,
	validate({ body: updateProfileBodySchema }),
	profileController.updateProfile,
);
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
