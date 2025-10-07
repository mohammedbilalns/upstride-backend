import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { IUserRepository } from "../../domain/repositories";
import { AppError } from "../errors/AppError";

export class InterestsService implements InterestsService {
	constructor(private _userRepository: IUserRepository) {}
	async fetchInterests(
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
