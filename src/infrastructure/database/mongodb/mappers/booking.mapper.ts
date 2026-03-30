import type {
	BookingStatus,
	PaymentStatus,
	PaymentType,
} from "../../../../domain/entities/booking.entity";
import { Booking } from "../../../../domain/entities/booking.entity";
import { toHHMM } from "../../../../shared/utilities/time.util";
import type { BookingDocument } from "../models/booking.model";

export class BookingMapper {
	static toDomain(doc: BookingDocument): Booking {
		return new Booking(
			doc._id.toString(),
			doc.mentorId.toString(),
			doc.menteeId.toString(),
			doc.startTime.toISOString(),
			doc.endTime.toISOString(),
			doc.status as BookingStatus,
			doc.meetingLink,
			doc.paymentType as PaymentType,
			doc.paymentStatus as PaymentStatus,
			doc.totalAmount,
			doc.currency,
			doc.notes,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(
		entity: Omit<Booking, "id" | "createdAt" | "updatedAt">,
	) {
		return {
			mentorId: entity.mentorId,
			menteeId: entity.menteeId,
			startTime: entity.startTime,
			endTime: entity.endTime,
			status: entity.status,
			meetingLink: entity.meetingLink,
			paymentType: entity.paymentType,
			paymentStatus: entity.paymentStatus,
			totalAmount: entity.totalAmount,
			currency: entity.currency,
			notes: entity.notes,
		};
	}

	/**
	 * Converts a Booking domain entity to a client-facing DTO.
	 */
	static toDTO(booking: Booking) {
		return {
			id: booking.id,
			mentorId: booking.mentorId,
			menteeId: booking.menteeId,
			startTime: toHHMM(new Date(booking.startTime)),
			endTime: toHHMM(new Date(booking.endTime)),
			startDate: booking.startTime.slice(0, 10),
			status: booking.status,
			meetingLink: booking.meetingLink,
			paymentType: booking.paymentType,
			paymentStatus: booking.paymentStatus,
			totalAmount: booking.totalAmount,
			currency: booking.currency,
			notes: booking.notes,
			createdAt: booking.createdAt,
			updatedAt: booking.updatedAt,
		};
	}
}
