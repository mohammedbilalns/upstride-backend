import type {
	GenerateReceiptPdfInput,
	GenerateReceiptPdfResponse,
} from "../dtos/reciept.dto";

export interface IGenerateReceiptPdfUseCase {
	execute(input: GenerateReceiptPdfInput): Promise<GenerateReceiptPdfResponse>;
}
