import { UserRole } from "../../../common/enums/user-roles";
import { ISkillRepository } from "../../../domain/repositories";
import { IFetchSkillsUC } from "../../../domain/useCases/expertiseMangement/fetch-skills.uc.interface";
import { fetchSkillsDto, FetchSkillsResponse } from "../../dtos";

export class FetchSkillsUC implements IFetchSkillsUC {
	constructor(private _skillRepository: ISkillRepository) {}

	async execute(dto: fetchSkillsDto): Promise<FetchSkillsResponse> {
		const isAdmin =
			dto.userRole === UserRole.ADMIN || dto.userRole === UserRole.SUPER_ADMIN;

		const [skills, total] = await Promise.all([
			this._skillRepository.findAll(
				dto.expertiseId,
				dto.page,
				dto.limit,
				dto.query,
				!isAdmin,
			),
			this._skillRepository.count(dto.expertiseId, dto.query),
		]);

		const mapped = skills.map((skill) => ({
			id: skill.id,
			name: skill.name,
			expertiseId: skill.expertiseId,
			...(isAdmin && {
				isVerified: skill.isVerified,
			}),
		}));

		return { expertises: mapped, total };
	}
}
