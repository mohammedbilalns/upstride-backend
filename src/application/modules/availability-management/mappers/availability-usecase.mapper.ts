import type { Availability } from "../../../../domain/entities/availability.entity";
import type { AvailabilityDto } from "../dtos/availability.dto";

export class AvailabilityUsecaseMapper {
	static toDto(entity: Availability): AvailabilityDto {
		return {
			id: entity.id,
			mentorId: entity.mentorId,
			name: entity.name,
			description: entity.description,
			days: Array.from(entity.days),
			startTime: entity.startTime,
			endTime: entity.endTime,
			startDate: entity.startDate,
			endDate: entity.endDate,
			breakTimes: entity.breakTimes,
			slotDuration: entity.slotDuration,
			bufferTime: entity.bufferTime,
			status: entity.status,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toDtos(entities: Availability[]): AvailabilityDto[] {
		return entities.map((entity) => AvailabilityUsecaseMapper.toDto(entity));
	}
}
