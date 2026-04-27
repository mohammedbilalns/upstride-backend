import type {
	RepayBookingInput,
	RepayBookingResponse,
} from "../dtos/booking.dto";

export interface IRepayBookingUseCase {
	execute(input: RepayBookingInput): Promise<RepayBookingResponse>;
}
