import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { IGetSessionsUC } from "../../../domain/useCases/sessions/get-sessions.uc.interface";
import { Booking } from "../../../domain/entities/booking.entity";
import { IUserService } from "../../../domain/services/user.service.interface";
import { IPaymentService } from "../../../domain/services/payment.service.interface";

export class GetSessionsUC implements IGetSessionsUC {
	constructor(
		private _bookingRepository: IBookingRepository,
		private _userService: IUserService,
		private _paymentService: IPaymentService,
	) {}

	async getUserHistory(userId: string): Promise<Booking[]> {
		const sessions = await this._bookingRepository.findHistory(userId, "user");
		const withMentor = await this.populateMentorDetails(sessions);
		return this.populatePaymentDetails(withMentor);
	}

	async getUserUpcoming(userId: string): Promise<Booking[]> {
		const sessions = await this._bookingRepository.findUpcoming(userId, "user");
		const withMentor = await this.populateMentorDetails(sessions);
		return this.populatePaymentDetails(withMentor);
	}

	async getMentorSessions(
		mentorId: string,
		type?: "upcoming" | "history",
	): Promise<Booking[]> {
		let sessions: Booking[] = [];
		if (type === "upcoming") {
			sessions = await this._bookingRepository.findUpcoming(mentorId, "mentor");
		} else if (type === "history") {
			sessions = await this._bookingRepository.findHistory(mentorId, "mentor");
		} else {
			sessions = await this._bookingRepository.findByMentorId(mentorId);
		}
		const withUser = await this.populateUserDetails(sessions);
		return this.populatePaymentDetails(withUser);
	}

	private async populateMentorDetails(sessions: Booking[]): Promise<Booking[]> {
		const mentorIds = [
			...new Set(
				sessions
					.map((s) => s.slot?.mentorId)
					.filter((id): id is string => !!id),
			),
		];
		if (mentorIds.length === 0) return sessions;

		try {
			const mentors = await this._userService.getUsersByIds(mentorIds);
			const mentorMap = new Map(mentors.map((m) => [m.id, m]));

			return sessions.map((session) => {
				if (session.slot?.mentorId) {
					session.mentorDetails = mentorMap.get(session.slot.mentorId);
				}
				return session;
			});
		} catch (error) {
			console.error("Failed to populate mentor details", error);
			return sessions;
		}
	}

	private async populateUserDetails(sessions: Booking[]): Promise<Booking[]> {
		const userIds = [...new Set(sessions.map((s) => s.userId).filter(Boolean))];
		if (userIds.length === 0) return sessions;

		try {
			const users = await this._userService.getUsersByIds(userIds);
			const userMap = new Map(users.map((u) => [u.id, u]));

			return sessions.map((session) => {
				session.userDetails = userMap.get(session.userId);
				return session;
			});
		} catch (error) {
			console.error("Failed to populate user details", error);
			return sessions;
		}
	}

	private async populatePaymentDetails(
		sessions: Booking[],
	): Promise<Booking[]> {
		const paymentIds = [
			...new Set(
				sessions.map((s) => s.paymentId).filter((id) => id && id !== "PENDING"),
			),
		];

		if (paymentIds.length === 0) return sessions;

		try {
			const payments = await this._paymentService.getPaymentsByIds(paymentIds);
			const paymentMap = new Map(payments.map((p) => [p.id, p]));

			return sessions.map((session) => {
				if (session.paymentId && session.paymentId !== "PENDING") {
					session.paymentDetails = paymentMap.get(session.paymentId);
				}
				return session;
			});
		} catch (error) {
			console.error("Failed to populate payment details", error);
			return sessions;
		}
	}
}
