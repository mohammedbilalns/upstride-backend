import { PaymentRepository } from "../../../infrastructure/database/repositories/payment.repository";
import { CreatePaymentUC } from "../../../application/useCases/create-payment.uc";
import { PaymentController } from "../controllers/payment.controller";
import { CapturePaymentUC } from "../../../application/useCases/capture-payment.uc";
import { PayWithWalletUC } from "../../../application/useCases/pay-with-wallet.uc";
import { WalletRepository } from "../../../infrastructure/database/repositories/wallet.repository";
import { LedgerRepository } from "../../../infrastructure/database/repositories/ledger.repository";
import { RazorpayService } from "../../../infrastructure/services/razorpay.service";
import { PdfService } from "../../../infrastructure/services/pdf.service";
import { CreateWalletUC } from "../../../application/useCases/wallets/create-wallet.uc";
import { RecordTransactionUC } from "../../../application/useCases/wallets/record-transaction.uc";
import { HandleWebhookUC } from "../../../application/useCases/handle-webhook.uc";
import { GetUserPaymentsUC } from "../../../application/useCases/get-user-payments.uc";
import { GetMentorPaymentsUC } from "../../../application/useCases/get-mentor-payments.uc";
import { GetPaymentReceiptUC } from "../../../application/useCases/payments/get-payment-receipt.uc";
import { GetPaymentsByIdsUC } from "../../../application/useCases/get-payments-by-ids.uc";
import eventBus from "../../../infrastructure/events/eventBus";

export function createPaymentController(): PaymentController {
    // ─────────────────────────────────────────────
    // Dependencies
    // ─────────────────────────────────────────────
    const paymentRepository = new PaymentRepository();
    const walletRepository = new WalletRepository();
    const ledgerRepository = new LedgerRepository();

    // Using RazorpayService as PaymentGatewayService
    const paymentGatewayService = new RazorpayService();

    // Use singleton eventBus which is initialized at startup
    // const eventBus = new RabbitMQEventBus();

    // ─────────────────────────────────────────────
    // Use Cases Helpers
    // ─────────────────────────────────────────────
    const createWalletUC = new CreateWalletUC(walletRepository);

    // RecordTransactionUC(walletRepo, ledgerRepo)
    const recordTransactionUC = new RecordTransactionUC(walletRepository, ledgerRepository);

    // ─────────────────────────────────────────────
    // Use Cases
    // ─────────────────────────────────────────────
    const createPaymentUC = new CreatePaymentUC(paymentRepository, paymentGatewayService);

    const capturePaymentUC = new CapturePaymentUC(
        paymentRepository,
        paymentGatewayService,
        eventBus,
        createWalletUC,
        recordTransactionUC
    );

    const payWithWalletUC = new PayWithWalletUC(
        walletRepository,
        paymentRepository,
        recordTransactionUC,
        createWalletUC,
        eventBus
    );

    const handleWebhookUC = new HandleWebhookUC(paymentRepository);
    const getUserPaymentsUC = new GetUserPaymentsUC(paymentRepository);
    const getMentorPaymentsUC = new GetMentorPaymentsUC(paymentRepository);

    // Pdf Service
    const pdfService = new PdfService();
    const getPaymentReceiptUC = new GetPaymentReceiptUC(paymentRepository, pdfService);
    const getPaymentsByIdsUC = new GetPaymentsByIdsUC(paymentRepository);

    // ─────────────────────────────────────────────
    // Controller
    // ─────────────────────────────────────────────
    return new PaymentController(
        createPaymentUC,
        capturePaymentUC,
        getUserPaymentsUC,
        getMentorPaymentsUC,
        handleWebhookUC,
        payWithWalletUC,
        getPaymentReceiptUC,
        getPaymentsByIdsUC
    );
}
