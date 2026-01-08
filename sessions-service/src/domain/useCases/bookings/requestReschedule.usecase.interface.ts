import { RequestRescheduleDto } from "../../../application/dtos/booking.dto";
import { Booking } from "../../entities/booking.entity";

export interface IRequestRescheduleUC {
	execute(dto: RequestRescheduleDto): Promise<Booking>;
}
