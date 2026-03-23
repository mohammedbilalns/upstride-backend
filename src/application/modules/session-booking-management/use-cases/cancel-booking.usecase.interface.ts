import type {
	CancelBookingInput,
	CancelBookingResponse,
} from "../dtos/session-booking.dto";

export interface ICancelBookingUseCase {
	execute(input: CancelBookingInput): Promise<CancelBookingResponse>;
}
