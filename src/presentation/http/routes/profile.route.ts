import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants";
import { ProfileController } from "../controllers";
import { validate, verifySession } from "../middlewares";
import {
	changePasswordBodySchema,
	requestChangePasswordBodySchema,
	updateProfileBodySchema,
	verifyProfileOtpBodySchema,
} from "../validators/index";

const router = Router();
const profileController = container.get(ProfileController);

router.use(verifySession);

router.get(ROUTES.PROFILE.ME, profileController.getMe);
router.get(ROUTES.PROFILE.ROOT, profileController.getProfile);
router.put(
	ROUTES.PROFILE.ROOT,
	validate({ body: updateProfileBodySchema }),
	profileController.updateProfile,
);

router.post(
	ROUTES.PROFILE.REQUEST_CHANGE_PASSWORD,
	validate({ body: requestChangePasswordBodySchema }),
	profileController.requestChangePassword,
);

router.post(
	ROUTES.PROFILE.VERIFY_OTP,
	validate({ body: verifyProfileOtpBodySchema }),
	profileController.verifyChangePasswordOtp,
);

router.put(
	ROUTES.PROFILE.CHANGE_PASSWORD,
	validate({ body: changePasswordBodySchema }),
	profileController.changePassword,
);

export { router as profileRouter };
