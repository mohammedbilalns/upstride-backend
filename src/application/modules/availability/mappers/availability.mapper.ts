import type { Availability } from "../../../../domain/entities/availability.entity";
import type {
	AvailabilityDto,
	ConflictAvailabilitySummary,
} from "../dtos/availability.dto";

export class AvailabilityMapper {
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
		return entities.map((entity) => AvailabilityMapper.toDto(entity));
	}

	static toConflictSummary(entity: Availability): ConflictAvailabilitySummary {
		return {
			name: entity.name,
			startDate: entity.startDate,
			endDate: entity.endDate,
			startTime: entity.startTime,
			endTime: entity.endTime,
		};
	}

	static toConflictSummaries(
		entities: Availability[],
	): ConflictAvailabilitySummary[] {
		return entities.map((entity) =>
			AvailabilityMapper.toConflictSummary(entity),
		);
	}
}
