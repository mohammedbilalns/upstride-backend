import type {
	CancelBookingInput,
	CancelBookingResponse,
} from "../dtos/booking.dto";

export interface ICancelBookingByMentorUseCase {
	execute(input: CancelBookingInput): Promise<CancelBookingResponse>;
}
