import type { Booking } from "../../../../domain/entities/booking.entity";
import type { BookingDto } from "../dtos/booking.dto";

export class BookingMapper {
	static toDto(entity: Booking): BookingDto {
		return {
			id: entity.id,
			mentorId: entity.mentorId,
			mentorUserId: entity.mentorUserId,
			menteeId: entity.menteeId,
			startTime: entity.startTime,
			endTime: entity.endTime,
			startDate: entity.startTime.split("T")[0],
			status: entity.status,
			paymentType: entity.paymentType,
			paymentStatus: entity.paymentStatus,
			totalAmount: entity.totalAmount,
			currency: entity.currency,
			meetingLink: entity.meetingLink,
			notes: entity.notes,
			menteeName: entity.menteeName ?? null,
			mentorName: entity.mentorName ?? null,
			createdAt: entity.createdAt.toISOString(),
			updatedAt: entity.updatedAt.toISOString(),
		};
	}

	static toDtos(entities: Booking[]): BookingDto[] {
		return entities.map((entity) => BookingMapper.toDto(entity));
	}
}
