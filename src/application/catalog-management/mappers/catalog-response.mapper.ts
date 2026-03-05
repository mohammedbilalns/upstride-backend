import type { Interest } from "../../../domain/entities/interest.entity";
import type { Skill } from "../../../domain/entities/skill.entity";
import type {
	CatalogInterestDto,
	CatalogSkillDto,
	GetOnboardingCatalogResponse,
} from "../dtos/get-onboarding-catalog.dto";

export class CatalogResponseMapper {
	static toDto(
		interests: Interest[],
		skills: Skill[],
	): GetOnboardingCatalogResponse {
		const groupedSkills = skills.reduce<Record<string, CatalogSkillDto[]>>(
			(acc, skill) => {
				if (!acc[skill.interestId]) {
					acc[skill.interestId] = [];
				}
				acc[skill.interestId].push({
					id: skill.id,
					name: skill.name,
					slug: skill.slug,
				});
				return acc;
			},
			{},
		);

		const mappedInterests: CatalogInterestDto[] = interests.map((interest) => ({
			id: interest.id,
			name: interest.name,
			slug: interest.slug,
			skills: groupedSkills[interest.id] || [],
		}));

		return {
			interests: mappedInterests,
		};
	}
}
