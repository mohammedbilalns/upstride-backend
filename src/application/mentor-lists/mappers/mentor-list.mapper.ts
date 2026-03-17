import type { MentorList } from "../../../domain/entities/mentor-list.entity";
import type { MentorListDto } from "../dtos/mentor-list.dto";

export class MentorListMapper {
	static toDto(entity: MentorList): MentorListDto {
		return {
			id: entity.id,
			name: entity.name,
			description: entity.description ?? null,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toDtos(entities: MentorList[]): MentorListDto[] {
		return entities.map((entity) => MentorListMapper.toDto(entity));
	}
}
