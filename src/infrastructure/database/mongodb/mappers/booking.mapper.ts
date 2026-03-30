import type { BookingStatus } from "../../../../domain/entities/booking.entity";
import { Booking } from "../../../../domain/entities/booking.entity";
import { toHHMM } from "../../../../shared/utilities/time.util";
import type { BookingDocument } from "../models/booking.model";

export class BookingMapper {
	static toDomain(doc: BookingDocument): Booking {
		return new Booking(
			doc._id.toString(),
			doc.mentorId.toString(),
			doc.menteeId.toString(),
			doc.startTime,
			doc.endTime,
			doc.status as BookingStatus,
			doc.meetingLink,
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
			notes: entity.notes,
		};
	}

	/**
	 * Converts a Booking domain entity to a client-facing DTO.
	 * Times are serialised as "HH:MM" (UTC) for display purposes.
	 */
	static toDTO(booking: Booking) {
		return {
			id: booking.id,
			mentorId: booking.mentorId,
			menteeId: booking.menteeId,
			startTime: toHHMM(booking.startTime),
			endTime: toHHMM(booking.endTime),
			startDate: booking.startTime.toISOString().slice(0, 10),
			status: booking.status,
			meetingLink: booking.meetingLink,
			notes: booking.notes,
			createdAt: booking.createdAt,
			updatedAt: booking.updatedAt,
		};
	}
}
