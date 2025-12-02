import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IMentorRepository } from "../../../domain/repositories";
import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { IFetchMentorDetailsUC } from "../../../domain/useCases/mentorManagement/fetchMentorDetails.uc.interface";
import { MentorDetailsDto } from "../../dtos";
import { AppError } from "../../errors/AppError";

export class FetchMentorDetailsUC implements IFetchMentorDetailsUC {
	constructor(
		private _mentorRepository: IMentorRepository,
		private _connectionRepository: IConnectionRepository,
	) {}

	async execute(mentorId: string, userId: string): Promise<MentorDetailsDto> {
		const mentor = await this._mentorRepository.findByMentorId(mentorId);
		if (!mentor)
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
		const followConnection =
			await this._connectionRepository.fetchByUserAndMentor(userId, mentorId);
		const isFollowing = !!followConnection;

		if (!mentor)
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
		return { ...mentor, isFollowing };
	}
}
