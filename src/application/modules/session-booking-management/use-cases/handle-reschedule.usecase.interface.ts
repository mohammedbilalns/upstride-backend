import type {
	HandleRescheduleInput,
	HandleRescheduleResponse,
} from "../dtos/session-booking.dto";

export interface IHandleRescheduleUseCase {
	execute(input: HandleRescheduleInput): Promise<HandleRescheduleResponse>;
}
