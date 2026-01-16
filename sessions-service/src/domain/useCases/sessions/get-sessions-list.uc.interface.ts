import { Booking } from "../../entities/booking.entity";

export interface IGetSessionsListUC {
    execute(
        userId: string,
        type: "upcoming" | "history",
        page: number,
        limit: number,
        mentorId?: string
    ): Promise<{ sessions: Booking[]; total: number }>;
}
