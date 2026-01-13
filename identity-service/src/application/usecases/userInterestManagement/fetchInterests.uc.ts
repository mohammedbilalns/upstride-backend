import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IUserRepository } from "../../../domain/repositories";
import { IFetchInterestsUC } from "../../../domain/useCases/userInterestManagement/fetch-interests.uc.interface";
import { AppError } from "../../errors/app-error";

export class FetchInterestsUC implements IFetchInterestsUC {
	constructor(private _userRepository: IUserRepository) {}

	async execute(
		userId: string,
	): Promise<{ expertises: string[]; skills: string[] }> {
		const user = await this._userRepository.findById(userId);
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
		return {
			expertises: user.interestedExpertises,
			skills: user.interestedSkills,
		};
	}
}
