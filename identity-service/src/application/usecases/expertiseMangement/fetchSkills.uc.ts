import { UserRole } from "../../../common/enums/userRoles";
import { ISkillRepository } from "../../../domain/repositories";
import { IFetchSkillsUC } from "../../../domain/useCases/expertiseMangement/fetchSkills.uc.interface";
import { fetchSkillsDto, FetchSkillsResponse } from "../../dtos";

export class FetchSkillsUC implements IFetchSkillsUC {
	constructor(private _skillRepository: ISkillRepository) {}

	async execute(data: fetchSkillsDto): Promise<FetchSkillsResponse> {
		const [skills, total] = await Promise.all([
			this._skillRepository.findAll(
				data.expertiseId,
				data.page,
				data.limit,
				data.query,
			),
			this._skillRepository.count(data.expertiseId, data.query),
		]);

		const isAdmin = data.userRole === UserRole.ADMIN || UserRole.SUPER_ADMIN;
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
