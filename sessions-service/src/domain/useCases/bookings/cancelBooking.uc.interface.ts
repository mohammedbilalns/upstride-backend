import { cancelBookingDto } from "../../../application/dtos/booking.dto";

export interface ICancelBookingUC {
	execute(dto: cancelBookingDto): Promise<void>;
}
