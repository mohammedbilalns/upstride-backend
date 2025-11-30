import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { IFetchSuggestedMentorsUC } from "../../../domain/useCases/fetchSuggestedMentors.uc.interface";
import { SuggestedMentorsResponseDto } from "../../dtos/connection.dto";
import { AppError } from "../../errors/AppError";

export class FetchSuggestedMentorsUC implements IFetchSuggestedMentorsUC {
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
	) {}

	async execute(
		userId: string,
		page: number,
		limit: number,
	): Promise<SuggestedMentorsResponseDto> {
		const user = await this._userRepository.findById(userId);
		if (!user)
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);

		const expertiseIds = user.interestedExpertises;
		const skillIds = user.interestedSkills;

		const suggestions = await this._mentorRepository.fetchSuggestedMentors(
			userId,
			expertiseIds,
			skillIds,
			page,
			limit,
		);
		return suggestions;
	}
}
