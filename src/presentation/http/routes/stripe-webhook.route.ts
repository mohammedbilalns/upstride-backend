import { Router, raw } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { PaymentController } from "../controllers";

const router = Router();
const paymentController = apiContainer.get(PaymentController);

router.post(
	"/",
	raw({ type: "application/json" }),
	paymentController.handleStripeWebhook,
);

export { router as stripeWebhookRouter };
