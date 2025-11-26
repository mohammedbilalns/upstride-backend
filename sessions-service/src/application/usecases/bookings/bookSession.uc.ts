import { IBookSessionUC } from "../../../domain/useCases/bookings/bookSession.uc.interface";
import { bookSessionDto } from "../../dtos/booking.dto";

export class BookSessionUc implements IBookSessionUC {
	async execute(dto: bookSessionDto): Promise<void> {
		console.log(dto);
		//TODO: implement
	}
}
