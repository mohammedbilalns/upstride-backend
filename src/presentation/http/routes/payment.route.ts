import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants";
import { PaymentController } from "../controllers";
import { validate, verifySession } from "../middlewares";
import { createCheckoutSessionBodySchema } from "../validators";

const router = Router();
const paymentController = container.get(PaymentController);

router.use(verifySession);

router.post(
	ROUTES.PAYMENTS.CHECKOUT_SESSION,
	validate({ body: createCheckoutSessionBodySchema }),
	paymentController.createCheckoutSession,
);

export { router as paymentRouter };
