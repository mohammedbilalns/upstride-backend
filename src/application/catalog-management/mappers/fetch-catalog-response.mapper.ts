import type { Interest } from "../../../domain/entities/interest.entity";
import type { Profession } from "../../../domain/entities/profession.entity";
import type { Skill } from "../../../domain/entities/skill.entity";
import type {
	FetchCatalogInterestDto,
	FetchCatalogProfessionDto,
	FetchCatalogResponse,
	FetchCatalogSkillDto,
} from "../dtos/fetch-catalog.dto";

export class FetchCatalogResponseMapper {
	static toDto(
		professions: Profession[],
		interests: Interest[],
		skills: Skill[],
	): FetchCatalogResponse {
		const groupedSkills = skills.reduce<Record<string, FetchCatalogSkillDto[]>>(
			(acc, skill) => {
				if (!acc[skill.interestId]) {
					acc[skill.interestId] = [];
				}
				acc[skill.interestId].push({
					id: skill.id,
					name: skill.name,
					slug: skill.slug,
					isActive: skill.isActive,
				});
				return acc;
			},
			{},
		);

		const mappedInterests: FetchCatalogInterestDto[] = interests.map(
			(interest) => ({
				id: interest.id,
				name: interest.name,
				slug: interest.slug,
				isActive: interest.isActive,
				skills: groupedSkills[interest.id] || [],
			}),
		);

		const mappedProfessions: FetchCatalogProfessionDto[] = professions.map(
			(p) => ({
				id: p.id,
				name: p.name,
				slug: p.slug,
				isActive: p.isActive,
			}),
		);

		return {
			professions: mappedProfessions,
			interests: mappedInterests,
		};
	}
}
