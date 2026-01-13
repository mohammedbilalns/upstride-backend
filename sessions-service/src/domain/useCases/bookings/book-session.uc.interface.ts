import { BookSessionDto } from "../../../application/dtos/booking.dto";

export interface IBookSessionUC {
	execute(
		dto: BookSessionDto,
	): Promise<{ bookingId: string; paymentId: string }>;
}
