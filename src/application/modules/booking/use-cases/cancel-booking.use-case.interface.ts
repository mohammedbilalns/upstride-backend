import type {
	CancelBookingInput,
	CancelBookingResponse,
} from "../dtos/booking.dto";

export interface ICancelBookingUseCase {
	execute(input: CancelBookingInput): Promise<CancelBookingResponse>;
}
