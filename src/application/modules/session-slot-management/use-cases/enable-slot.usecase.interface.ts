import type {
	EnableSlotInput,
	EnableSlotResponse,
} from "../dtos/session-slots.dto";

export interface IEnableSlotUseCase {
	execute(input: EnableSlotInput): Promise<EnableSlotResponse>;
}
