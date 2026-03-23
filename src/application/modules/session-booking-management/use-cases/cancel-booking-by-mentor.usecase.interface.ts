import type {
	CancelBookingInput,
	CancelBookingResponse,
} from "../dtos/session-booking.dto";

export interface ICancelBookingByMentorUseCase {
	execute(input: CancelBookingInput): Promise<CancelBookingResponse>;
}
