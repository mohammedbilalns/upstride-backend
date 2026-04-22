export interface GenerateReceiptPdfInput {
	userId: string;
	bookingId: string;
}

export interface GenerateReceiptPdfResponse {
	pdfBuffer: Buffer;
	filename: string;
}
