import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { ROUTES } from "../constants";
import { ProfileController } from "../controllers";
import { validate, verifySession } from "../middlewares";
import {
	ChangePasswordBodySchema,
	RequestChangePasswordBodySchema,
	UpdateProfileBodySchema,
	VerifyProfileOtpBodySchema,
} from "../validators/index";

const router = Router();
const profileController = apiContainer.get(ProfileController);

router.use(verifySession);

router.get(ROUTES.PROFILE.ME, profileController.getMe);
router.get(ROUTES.PROFILE.ROOT, profileController.getProfile);
router.put(
	ROUTES.PROFILE.ROOT,
	validate({ body: UpdateProfileBodySchema }),
	profileController.updateProfile,
);

router.post(
	ROUTES.PROFILE.REQUEST_CHANGE_PASSWORD,
	validate({ body: RequestChangePasswordBodySchema }),
	profileController.requestChangePassword,
);

router.post(
	ROUTES.PROFILE.VERIFY_OTP,
	validate({ body: VerifyProfileOtpBodySchema }),
	profileController.verifyChangePasswordOtp,
);

router.put(
	ROUTES.PROFILE.CHANGE_PASSWORD,
	validate({ body: ChangePasswordBodySchema }),
	profileController.changePassword,
);

export { router as profileRouter };
