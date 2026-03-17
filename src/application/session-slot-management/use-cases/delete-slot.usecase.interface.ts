import type {
	DeleteSlotInput,
	DeleteSlotResponse,
} from "../dtos/session-slots.dto";

export interface IDeleteSlotUseCase {
	execute(input: DeleteSlotInput): Promise<DeleteSlotResponse>;
}
