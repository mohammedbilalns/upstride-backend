import type { RescheduleBookingInput } from "../dtos/booking.dto";

export interface IRescheduleBookingUseCase {
	execute(input: RescheduleBookingInput): Promise<void>;
}
