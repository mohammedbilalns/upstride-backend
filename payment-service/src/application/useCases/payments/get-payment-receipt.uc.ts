import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IPaymentRepository } from "../../../domain/repositories/payment.repository.interface";
import { IGetPaymentReceiptUC } from "../../../domain/useCases/payments/get-payment-receipt.uc.interface";
import { AppError } from "../../errors/app-error";
import { IPdfService } from "../../../domain/services/pdf.service.interface";

export class GetPaymentReceiptUC implements IGetPaymentReceiptUC {
    constructor(
        private _paymentRepository: IPaymentRepository,
        private _pdfService: IPdfService
    ) { }

    async execute(userId: string, paymentId: string): Promise<Buffer> {
        const payment = await this._paymentRepository.findById(paymentId);
        if (!payment) {
            throw new AppError(ErrorMessage.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (payment.userId !== userId) {
            throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
        }

        const doc = await this._pdfService.createDocument();
        const buffers: Buffer[] = [];
        doc.on("data", (chunk: any) => buffers.push(chunk));
        doc.on("end", () => { });

        // Header
        doc.fontSize(20).text("UpStride", { align: "center" });
        doc.fontSize(12).text("Payment Receipt", { align: "center" });
        doc.moveDown();
        doc.fontSize(10).text(`Receipt ID: ${payment.id}`, { align: "right" });
        doc.text(`Date: ${payment.createdAt.toISOString().split("T")[0]}`, { align: "right" });
        doc.moveDown();

        // Transaction Details Table
        const startX = 50;
        const col1To = 200;
        let currentY = doc.y;

        doc.fontSize(14).text("Transaction Details", startX, currentY);
        doc.moveDown();
        doc.moveTo(startX, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        const row = (label: string, value: string) => {
            currentY = doc.y;
            doc.fontSize(10).text(label, startX, currentY, { width: 150 });
            doc.text(value, col1To, currentY);
            doc.moveDown(0.5);
        };

        row("Description", "Mentorship Session");
        row("Order ID", payment.orderId);
        row("Payment Method", payment.paymentMethod);
        row("Status", payment.status);
        row("Amount", `${payment.currency} ${payment.amount}`);

        doc.moveDown();
        doc.moveTo(startX, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Total
        doc.fontSize(12).font("Helvetica-Bold");
        doc.text(`Total Paid: ${payment.currency} ${payment.amount}`, { align: "right" });

        // Footer
        doc.fontSize(10).font("Helvetica");
        doc.moveDown(4);
        doc.text("Thank you for using UpStride!", { align: "center" });

        doc.end();

        return new Promise((resolve) => {
            doc.on("end", () => resolve(Buffer.concat(buffers)));
        });
    }
}
