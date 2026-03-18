import type { SessionBooking } from "../../../domain/entities/session-booking.entity";
import type { BookingListItemDto } from "../dtos/get-bookings.dto";

export class SessionBookingDtoMapper {
	static toListItem(entity: SessionBooking): BookingListItemDto {
		return {
			id: entity.id,
			userId: entity.userId,
			mentorId: entity.mentorId,
			slotId: entity.slotId,
			startTime: entity.startTime,
			endTime: entity.endTime,
			price: entity.price,
			status: entity.status,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toListItems(entities: SessionBooking[]): BookingListItemDto[] {
		return entities.map((entity) => SessionBookingDtoMapper.toListItem(entity));
	}
}
