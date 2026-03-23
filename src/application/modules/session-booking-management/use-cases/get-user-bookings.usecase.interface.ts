import type {
	GetBookingsInput,
	GetBookingsResponse,
} from "../dtos/get-bookings.dto";

export interface IGetUserBookingsUseCase {
	execute(input: GetBookingsInput): Promise<GetBookingsResponse>;
}
