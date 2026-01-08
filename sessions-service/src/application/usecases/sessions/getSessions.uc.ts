import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { IGetSessionsUC } from "../../../domain/useCases/sessions/getSessions.uc.interface";
import { Booking } from "../../../domain/entities/booking.entity";

export class GetSessionsUC implements IGetSessionsUC {
	constructor(private _bookingRepository: IBookingRepository) {}

	async getUserHistory(userId: string): Promise<Booking[]> {
		const bookings = await this._bookingRepository.findByUserId(userId);
		return bookings;
	}

	async getUserUpcoming(userId: string): Promise<Booking[]> {
		return this._bookingRepository.findUpcomingByUserId(userId);
	}

	async getMentorSessions(_mentorId: string): Promise<Booking[]> {
		// const bookings = await this._bookingRepository.findByMentorId(mentorId);
		return [];
	}
}
