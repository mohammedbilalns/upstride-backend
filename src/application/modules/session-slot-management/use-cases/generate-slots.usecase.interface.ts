import type {
	GenerateSlotsInput,
	GenerateSlotsResponse,
} from "../dtos/session-slots.dto";

export interface IGenerateSlotsUseCase {
	execute(input: GenerateSlotsInput): Promise<GenerateSlotsResponse>;
}
