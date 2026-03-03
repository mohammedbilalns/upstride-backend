import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants/route-paths";
import { AuthController } from "../controllers";
import { validate } from "../middlewares/validator.middleware";
import {
	loginBodySchema,
	passwordResetBodySchema,
	registerBodySchema,
} from "../validators";

const router = Router();
const authController = container.get(AuthController);

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
	ROUTES.AUTH.REQUEST_PASSWORD_RESET,
	validate({ body: passwordResetBodySchema }),
	authController.requestPasswordReset,
);

export { router as authRouter };
