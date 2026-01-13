import { CreatePaymentUC } from "../../../application/useCases/create-payment.uc";
import { CapturePaymentUC } from "../../../application/useCases/capture-payment.uc";
import { GetUserPaymentsUC } from "../../../application/useCases/get-user-payments.uc";
import { GetMentorPaymentsUC } from "../../../application/useCases/get-mentor-payments.uc";
import { HandleWebhookUC } from "../../../application/useCases/handle-webhook.uc";
import { PaymentRepository } from "../../../infrastructure/database/repositories/payment.repository";
import { RazorpayService } from "../../../infrastructure/services/razorpay.service";
import { PaymentController } from "../controllers/payment.controller";

import eventBus from "../../../infrastructure/events/eventBus";

export function createPaymentController(): PaymentController {
	// ─────────────────────────────────────────────
	// Dependencies
	// ─────────────────────────────────────────────
	const paymentRepository = new PaymentRepository();
	const razorpayService = new RazorpayService();

	// ─────────────────────────────────────────────
	// Use Cases
	// ─────────────────────────────────────────────
	// Dependencies are now injected via interfaces
	const createPaymentUC = new CreatePaymentUC(
		paymentRepository,
		razorpayService,
	);
	const capturePaymentUC = new CapturePaymentUC(
		paymentRepository,
		razorpayService,
		eventBus,
	);
	const getUserPaymentsUC = new GetUserPaymentsUC(paymentRepository);
	const getMentorPaymentsUC = new GetMentorPaymentsUC(paymentRepository);
	const handleWebhookUC = new HandleWebhookUC(paymentRepository);

	// ─────────────────────────────────────────────
	// Controller
	// ─────────────────────────────────────────────
	return new PaymentController(
		createPaymentUC,
		capturePaymentUC,
		getUserPaymentsUC,
		getMentorPaymentsUC,
		handleWebhookUC,
	);
}
