import { CancelBookingDto } from "../../../application/dtos/booking.dto";

export interface ICancelBookingUC {
	execute(dto: CancelBookingDto): Promise<void>;
}
