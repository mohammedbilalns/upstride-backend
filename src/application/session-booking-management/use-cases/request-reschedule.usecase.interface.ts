import type {
	RequestRescheduleInput,
	RequestRescheduleResponse,
} from "../dtos/session-booking.dto";

export interface IRequestRescheduleUseCase {
	execute(input: RequestRescheduleInput): Promise<RequestRescheduleResponse>;
}
