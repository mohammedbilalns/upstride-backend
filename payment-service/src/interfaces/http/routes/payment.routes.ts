import { Router } from "express";
import { createPaymentController } from "../compositions/payment.composition";

const router = Router();
const controller = createPaymentController();

router.post("/", controller.createPayment);
router.post("/capture", controller.capturePayment);
router.post("/webhook", controller.handleWebhook);
router.get("/user", controller.getUserPayments);
router.get("/mentor", controller.getMentorPayments);

export default router;
