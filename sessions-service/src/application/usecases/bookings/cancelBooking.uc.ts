import { ICancelBookingUC } from "../../../domain/useCases/bookings/cancelBooking.uc.interface";
import { cancelBookingDto } from "../../dtos/booking.dto";

export class CancelBookingUC implements ICancelBookingUC {
	async execute(dto: cancelBookingDto): Promise<void> {
		console.log(dto);
		//TODO: implement
	}
}
