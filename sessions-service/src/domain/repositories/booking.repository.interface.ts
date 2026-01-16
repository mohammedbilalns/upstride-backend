import type { Booking } from "../entities/booking.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IBookingRepository extends IBaseRepository<Booking> {
	findByPaymentId(paymentId: string): Promise<Booking | null>;
	findBySlotId(slotId: string): Promise<Booking | null>;
	findByUserId(userId: string): Promise<Booking[]>;
	findByMentorId(mentorId: string): Promise<Booking[]>;
	findUpcoming(id: string, role: "user" | "mentor"): Promise<Booking[]>;
	findHistory(id: string, role: "user" | "mentor"): Promise<Booking[]>;
	findUserSessions(
		userId: string,
		type: "upcoming" | "history",
		page: number,
		limit: number,
		mentorId?: string
	): Promise<{ sessions: Booking[]; total: number }>;
	updateRescheduleStatus(
		bookingId: string,
		status: "PENDING" | "REJECTED" | "APPROVED",
		requestDetails?: any,
	): Promise<Booking | null>;
}
