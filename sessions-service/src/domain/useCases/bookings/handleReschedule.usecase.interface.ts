import { HandleRescheduleDto } from "../../../application/dtos/booking.dto";
import { Booking } from "../../entities/booking.entity";

export interface IHandleRescheduleUC {
	execute(dto: HandleRescheduleDto): Promise<Booking>;
}
