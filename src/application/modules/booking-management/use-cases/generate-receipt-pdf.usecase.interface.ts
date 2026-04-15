import type {
	GenerateReceiptPdfInput,
	GenerateReceiptPdfResponse,
} from "./generate-receipt-pdf.usecase";

export interface IGenerateReceiptPdfUseCase {
	execute(input: GenerateReceiptPdfInput): Promise<GenerateReceiptPdfResponse>;
}
