import { Mentor } from "../../../domain/entities";
import { IMentorRepository } from "../../../domain/repositories";
import { IFetchMentorByExpertiseUC } from "../../../domain/useCases/mentorManagement/fetch-mentor-by-expertise.uc.interface";

export class FetchMentorByExpertiseUC implements IFetchMentorByExpertiseUC {
	constructor(private _mentorRepository: IMentorRepository) {}

	async execute(expertiseId: string): Promise<string[]> {
		const mentors = await this._mentorRepository.findByExpertiseId(expertiseId);
		return mentors.map((mentor: Mentor) => mentor.userId);
	}
}
