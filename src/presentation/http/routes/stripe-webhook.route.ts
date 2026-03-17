import { Router, raw } from "express";
import { container } from "../../../main/container";
import { PaymentController } from "../controllers";

const router = Router();
const paymentController = container.get(PaymentController);

router.post(
	"/",
	raw({ type: "application/json" }),
	paymentController.handleStripeWebhook,
);

export { router as stripeWebhookRouter };
