import type {
	GetBookingsInput,
	GetBookingsResponse,
} from "../dtos/booking.dto";

export interface IGetMentorBookingsUseCase {
	execute(input: GetBookingsInput): Promise<GetBookingsResponse>;
}
