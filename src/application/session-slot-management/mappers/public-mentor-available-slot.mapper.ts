import type { SessionSlot } from "../../../domain/entities/session-slot.entity";
import type { PublicMentorAvailableSlotDto } from "../dtos/public-mentor-slots.dto";

export class PublicMentorAvailableSlotMapper {
	static toDTO(slot: SessionSlot): PublicMentorAvailableSlotDto {
		return {
			id: slot.id,
			startTime: slot.startTime,
			endTime: slot.endTime,
			durationMinutes: slot.durationMinutes,
			price: slot.price,
			currency: slot.currency,
		};
	}

	static toDTOs(slots: SessionSlot[]): PublicMentorAvailableSlotDto[] {
		return slots.map((slot) => PublicMentorAvailableSlotMapper.toDTO(slot));
	}
}
