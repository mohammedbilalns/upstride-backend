import { CreatePaymentUC } from "../../../application/useCases/createPayment.uc";
import { CapturePaymentUC } from "../../../application/useCases/capturePayment.uc";
import { GetUserPaymentsUC } from "../../../application/useCases/getUserPayments.uc";
import { GetMentorPaymentsUC } from "../../../application/useCases/getMentorPayments.uc";
import { HandleWebhookUC } from "../../../application/useCases/handleWebhook.uc";
import { PaymentRepository } from "../../../infrastructure/database/repositories/payment.repository";
import { PayPalService } from "../../../infrastructure/external/paypal.service";
import { PaymentController } from "../controllers/payment.controller";

import eventBus from "../../../infrastructure/events/eventBus";

export function createPaymentController(): PaymentController {
	// ─────────────────────────────────────────────
	// Dependencies
	// ─────────────────────────────────────────────
	const paymentRepository = new PaymentRepository();
	const payPalService = new PayPalService();

	// ─────────────────────────────────────────────
	// Use Cases
	// ─────────────────────────────────────────────
	// Dependencies are now injected via interfaces
	const createPaymentUC = new CreatePaymentUC(paymentRepository, payPalService);
	const capturePaymentUC = new CapturePaymentUC(
		paymentRepository,
		payPalService,
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
