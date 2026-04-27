import type {
	CreateBookingInput,
	CreateBookingResponse,
} from "../dtos/booking.dto";

export interface ICreateBookingUseCase {
	execute(input: CreateBookingInput): Promise<CreateBookingResponse>;
}
