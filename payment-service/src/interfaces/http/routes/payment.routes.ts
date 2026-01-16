import { Router } from "express";
import { createPaymentController } from "../compositions/payment.composition";
import { authMiddleware, authorizeRoles } from "../middlewares";

export function createPaymentRoutes(): Router {
    const router = Router();
    const paymentController = createPaymentController();

    router.get("/", paymentController.getPaymentsByIds);

    router.use(authMiddleware(), authorizeRoles("mentor", "user"))
    router.post("/", paymentController.createPayment);
    router.post("/capture", paymentController.capturePayment);
    router.post("/wallet", paymentController.payWithWallet);
    router.post("/webhook", paymentController.handleWebhook);
    router.get("/user", paymentController.getUserPayments);
    router.get("/user", paymentController.getUserPayments);
    router.get("/mentor", paymentController.getMentorPayments);
    router.get("/:paymentId/receipt", paymentController.getPaymentReceipt);

    return router;
}
