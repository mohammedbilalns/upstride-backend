import { Router } from "express";
import { apiContainer } from "../../../main/api.container";
import { ROUTES } from "../constants";
import { PaymentController } from "../controllers";
import { validate, verifySession } from "../middlewares";
import { CreateCheckoutSessionBodySchema } from "../validators";

const router = Router();
const paymentController = apiContainer.get(PaymentController);

router.use(verifySession);

router.post(
	ROUTES.PAYMENTS.CHECKOUT_SESSION,
	validate({ body: CreateCheckoutSessionBodySchema }),
	paymentController.createCheckoutSession,
);

export { router as paymentRouter };
