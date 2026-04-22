import type {
	GetBookingsInput,
	GetBookingsResponse,
} from "../dtos/booking.dto";

export interface IGetUserBookingsUseCase {
	execute(input: GetBookingsInput): Promise<GetBookingsResponse>;
}
