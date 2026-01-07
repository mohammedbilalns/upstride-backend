import { BookSessionDto } from "../../../application/dtos/booking.dto";

export interface IBookSessionUC {
	execute(dto: BookSessionDto): Promise<void>;
}
