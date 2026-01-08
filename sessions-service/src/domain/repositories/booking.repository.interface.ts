import type { Booking } from "../entities/booking.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IBookingRepository extends IBaseRepository<Booking> {
	findByPaymentId(paymentId: string): Promise<Booking | null>;
	findByUserId(userId: string): Promise<Booking[]>;
	findUpcomingByUserId(userId: string): Promise<Booking[]>;
}
