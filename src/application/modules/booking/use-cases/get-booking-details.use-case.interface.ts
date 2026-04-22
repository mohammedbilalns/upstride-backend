import type {
	GetBookingDetailsInput,
	GetBookingDetailsResponse,
} from "../dtos/booking.dto";

export interface IGetBookingDetailsUseCase {
	execute(input: GetBookingDetailsInput): Promise<GetBookingDetailsResponse>;
}
