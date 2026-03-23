import type {
	CreateCustomSlotInput,
	CreateCustomSlotResponse,
} from "../dtos/session-slots.dto";

export interface ICreateCustomSlotUseCase {
	execute(input: CreateCustomSlotInput): Promise<CreateCustomSlotResponse>;
}
