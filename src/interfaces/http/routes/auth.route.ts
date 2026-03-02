import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants/route-paths";
import { AuthController } from "../controllers";
import { validate } from "../middlewares/validator.middleware";
import { loginBodySchema } from "../validators/login.schema";

const router = Router();
const authController = container.get(AuthController);

router.post(
	ROUTES.AUTH.LOGIN,
	validate({ body: loginBodySchema }),
	authController.login,
);

export { router as authRouter };
