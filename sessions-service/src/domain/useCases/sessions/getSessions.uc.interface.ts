import { Booking } from "../../../domain/entities/booking.entity";

export interface IGetSessionsUC {
	getUserHistory(userId: string): Promise<Booking[]>;
	getUserUpcoming(userId: string): Promise<Booking[]>;
	getMentorSessions(mentorId: string): Promise<Booking[]>; // TODO: Implement mentor repo method if needed
}
