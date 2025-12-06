import { ISkillRepository } from "../../domain/repositories";
import { IExpertiseHelperService } from "../../domain/services/expertiseHelper.service.interface";

export class ExpertiseHelperService implements IExpertiseHelperService {
	constructor(private _skillRepository: ISkillRepository) {}

	async processNewSkills(
		skillNames: string[],
		expertiseId: string,
	): Promise<string[]> {
		if (!skillNames || skillNames.length === 0) return [];
		const docs = await Promise.all(
			skillNames.map((skill) =>
				this._skillRepository.createIfNotExists({
					name: skill,
					isVerified: false,
					expertiseId: expertiseId,
				}),
			),
		);
		return docs.map((s) => s.id);
	}
}
