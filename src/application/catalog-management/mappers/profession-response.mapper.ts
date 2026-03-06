import type { Profession } from "../../../domain/entities/profession.entity";
import type { ProfessionDto } from "../dtos/profession.dto";

export class ProfessionResponseMapper {
	static toDto(profession: Profession): ProfessionDto {
		return {
			id: profession.id,
			name: profession.name,
			slug: profession.slug,
		};
	}

	static toDtoList(professions: Profession[]): ProfessionDto[] {
		return professions.map((profession) =>
			ProfessionResponseMapper.toDto(profession),
		);
	}
}
