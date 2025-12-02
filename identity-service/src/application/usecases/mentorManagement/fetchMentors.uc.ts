import { IMentorRepository } from "../../../domain/repositories";
import { IFetchMentorsUC } from "../../../domain/useCases/mentorManagement/fetchMentors.uc.interface";
import { findAllMentorsDto, findAllMentorsResponseDto } from "../../dtos";

export class FetchMentorsUC implements IFetchMentorsUC {
	constructor(private _mentorRepository: IMentorRepository) {}

	async execute(dto: findAllMentorsDto): Promise<findAllMentorsResponseDto> {
		const { page, limit, query, status } = dto;

		const [mentors, totalMentos, totalPending, totalApproved, totalRejected] =
			await Promise.all([
				this._mentorRepository.findAll({
					page,
					limit,
					query,
					status,
				}),
				this._mentorRepository.count(query),
				this._mentorRepository.count(query, "pending"),
				this._mentorRepository.count(query, "approved"),
				this._mentorRepository.count(query, "rejected"),
			]);

		return {
			mentors,
			totalMentors: totalMentos,
			totalPending,
			totalApproved,
			totalRejected,
		};
	}
}
