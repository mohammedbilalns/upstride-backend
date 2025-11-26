import { bookSessionDto } from "../../../application/dtos/booking.dto";

export interface IBookSessionUC {
	execute(dto: bookSessionDto): Promise<void>;
}
