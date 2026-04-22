import type {
	GetAvailableSlotsInput,
	GetAvailableSlotsResponse,
} from "../dtos/booking.dto";

export interface IGetAvailableSlotsUseCase {
	execute(input: GetAvailableSlotsInput): Promise<GetAvailableSlotsResponse>;
}
