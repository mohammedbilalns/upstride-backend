import type { Booking } from "../../../../domain/entities/booking.entity";
import type { BookingDto } from "../dtos/booking.dto";

export class BookingUsecaseMapper {
	static toDto(entity: Booking): BookingDto {
		return {
			id: entity.id,
			mentorId: entity.mentorId,
			menteeId: entity.menteeId,
			startTime: entity.startTime,
			endTime: entity.endTime,
			startDate: entity.startTime.split("T")[0],
			status: entity.status,
			meetingLink: entity.meetingLink,
			notes: entity.notes,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toDtos(entities: Booking[]): BookingDto[] {
		return entities.map((entity) => BookingUsecaseMapper.toDto(entity));
	}
}
