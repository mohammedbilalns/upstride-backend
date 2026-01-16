import { Booking } from "../../../domain/entities/booking.entity";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { IPaymentService } from "../../../domain/services/payment.service.interface";
import { IUserService } from "../../../domain/services/user.service.interface";
import { IGetSessionsListUC } from "../../../domain/useCases/sessions/get-sessions-list.uc.interface";
import { IMentorService } from "../../../domain/services/mentor.service.interface";

export class GetSessionsListUC implements IGetSessionsListUC {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _userService: IUserService,
        private _paymentService: IPaymentService,
        private _mentorService: IMentorService,
    ) { }

    async execute(
        userId: string,
        type: "upcoming" | "history",
        page: number,
        limit: number,
        mentorId?: string
    ): Promise<{ sessions: Booking[]; total: number }> {
        const { sessions, total } = await this._bookingRepository.findUserSessions(
            userId,
            type,
            page,
            limit,
            mentorId
        );

        // Populate details

        const withMentor = await this.populateMentorDetails(sessions);
        const withUser = await this.populateUserDetails(withMentor);
        const populatedSessions = await this.populatePaymentDetails(withUser);

        return {
            sessions: populatedSessions,
            total
        };
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

        const mentors = await this._mentorService.getMentorsByIds(mentorIds);
        const mentorMap = new Map(mentors.map((m) => [m.id, m]));

        return sessions.map((session) => {
            if (session.slot?.mentorId) {
                const mentor = mentorMap.get(session.slot.mentorId);
                if (mentor && mentor.user) {
                    session.mentorDetails = {
                        id: mentor.user.id,
                        name: mentor.user.name,
                        email: mentor.user.email,
                        profilePicture: mentor.user.profilePicture,
                        role: mentor.user.role
                    };
                }
            }
            return session;
        });
    }

    private async populateUserDetails(sessions: Booking[]): Promise<Booking[]> {
        const userIds = [...new Set(sessions.map((s) => s.userId).filter(Boolean))];
        if (userIds.length === 0) return sessions;

        const users = await this._userService.getUsersByIds(userIds);
        const userMap = new Map(users.map((u) => [u.id, u]));

        return sessions.map((session) => {
            session.userDetails = userMap.get(session.userId);
            return session;
        });
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

        const payments = await this._paymentService.getPaymentsByIds(paymentIds);
        const paymentMap = new Map(payments.map((p) => [p.id, p]));

        return sessions.map((session) => {
            if (session.paymentId && session.paymentId !== "PENDING") {
                session.paymentDetails = paymentMap.get(session.paymentId);
            }
            return session;
        });
    }
}
