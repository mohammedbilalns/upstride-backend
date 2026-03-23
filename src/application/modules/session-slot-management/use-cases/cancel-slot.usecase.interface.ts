import type {
	CancelSlotInput,
	CancelSlotResponse,
} from "../dtos/session-slots.dto";

export interface ICancelSlotUseCase {
	execute(input: CancelSlotInput): Promise<CancelSlotResponse>;
}
