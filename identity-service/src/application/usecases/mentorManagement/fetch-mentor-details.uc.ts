import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IMentorRepository } from "../../../domain/repositories";
import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { IFetchMentorDetailsUC } from "../../../domain/useCases/mentorManagement/fetch-mentor-details.uc.interface";
import { MentorDetailsDto } from "../../dtos";
import { AppError } from "../../errors/app-error";

/**
 * Use Case: Fetch detailed mentor profile and check follow status
 *
 *  - Retrieve mentor profile details
 *  - Determine if requesting user already follows the mentor
 */
export class FetchMentorDetailsUC implements IFetchMentorDetailsUC {
	constructor(
		private _mentorRepository: IMentorRepository,
		private _connectionRepository: IConnectionRepository,
	) {}

	async execute(mentorId: string, userId: string): Promise<MentorDetailsDto> {
		// Retrieve mentor profile details
		const mentor = await this._mentorRepository.findByMentorId(mentorId);
		if (!mentor)
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);

		// Check if user already follows the mentor
		const followConnection =
			await this._connectionRepository.fetchByUserAndMentor(userId, mentorId);
		const isFollowing = !!followConnection;

		// Return mentor profile details and follow status
		return { ...mentor, isFollowing };
	}
}
