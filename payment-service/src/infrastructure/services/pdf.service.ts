import PDFDocument from "pdfkit";
import { Payment } from "../../domain/entities/payment.entity";
import { IPdfService } from "../../domain/services/pdf.service.interface";

export class PdfService implements IPdfService {
    async generateReceipt(payment: Payment): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const buffers: Buffer[] = [];

            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", (err) => reject(err));

            // PDF Content
            doc.fontSize(20).text("Payment Receipt", { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Payment ID: ${payment.id}`);
            doc.text(`Date: ${payment.createdAt.toISOString()}`);
            doc.moveDown();
            doc.text(`Amount: ${payment.amount} ${payment.currency}`);
            doc.text(`Status: ${payment.status}`);
            doc.text(`Method: ${payment.paymentMethod}`);

            if (payment.bookingId) {
                doc.text(`Booking Reference: ${payment.bookingId}`);
            }

            doc.moveDown();
            doc.text("Thank you for using UpStride!", { align: "center" });

            doc.end();
        });
    }

    createDocument(): any {
        return new PDFDocument();
    }
}
