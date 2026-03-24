import type {
	GetBookingsInput,
	GetBookingsResponse,
} from "../dtos/get-bookings.dto";

export interface IGetMentorBookingsUseCase {
	execute(input: GetBookingsInput): Promise<GetBookingsResponse>;
}
