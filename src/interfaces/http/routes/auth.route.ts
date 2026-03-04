import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants/route-paths";
import { AuthController, PasswordResetController } from "../controllers";
import { verifySession } from "../middlewares";
import { validate } from "../middlewares/validator.middleware";
import {
	loginBodySchema,
	passwordResetBodySchema,
	registerBodySchema,
	resendOtpBodySchema,
	verifyOtpBodySchema,
} from "../validators";
import { changePasswordBodySchema } from "../validators/change-password.schema";

const router = Router();
const authController = container.get(AuthController);
const passwordResetController = container.get(PasswordResetController);

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

router.post(ROUTES.AUTH.LOGOUT, verifySession, authController.logout);
export { router as authRouter };
