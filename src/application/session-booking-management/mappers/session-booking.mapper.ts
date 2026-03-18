import type { SessionBooking } from "../../../domain/entities/session-booking.entity";
import type { BookingListItemDto } from "../dtos/get-bookings.dto";

export class SessionBookingDtoMapper {
	static toListItem(
		entity: SessionBooking,
		mentorName: string | null,
		now: Date,
	): BookingListItemDto {
		const isPast = entity.endTime.getTime() < now.getTime();
		let attendanceStatus: "attended" | "not_attended" | null = null;
		if (isPast) {
			attendanceStatus =
				entity.status === "completed" ? "attended" : "not_attended";
		}

		return {
			id: entity.id,
			userId: entity.userId,
			mentorId: entity.mentorId,
			mentorName,
			slotId: entity.slotId,
			startTime: entity.startTime,
			endTime: entity.endTime,
			price: entity.price,
			status: entity.status,
			attendanceStatus,
			meetingId: entity.meeting?.roomId ?? entity.meeting?.joinUrl ?? entity.id,
			meetingUrl: entity.meeting?.joinUrl ?? entity.id,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toListItems(
		entities: SessionBooking[],
		mentorNames: Map<string, string>,
		now: Date = new Date(),
	): BookingListItemDto[] {
		return entities.map((entity) =>
			SessionBookingDtoMapper.toListItem(
				entity,
				mentorNames.get(entity.mentorId) ?? null,
				now,
			),
		);
	}
}
