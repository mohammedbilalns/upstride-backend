import { Booking } from "../../../domain/entities/booking.entity";

export interface IGetSessionsUC {
	getUserHistory(userId: string): Promise<Booking[]>;
	getUserUpcoming(userId: string): Promise<Booking[]>;
	getMentorSessions(
		mentorId: string,
		type?: "upcoming" | "history",
	): Promise<Booking[]>;
}
