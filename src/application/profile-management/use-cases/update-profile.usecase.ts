import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../domain/repositories";
import { UserPreferencesLimits } from "../../../shared/constants/app.constants";
import { TYPES } from "../../../shared/types/types";
import { UserNotFoundError } from "../../authentication/errors";
import { ValidationError } from "../../shared/errors/validation-error";
import type { UpdateProfileInput } from "../dtos/update-profile.dto";
import type { IUpdateProfileUseCase } from "./update-profile.usecase.interface";

@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
	) {}

	async execute(input: UpdateProfileInput): Promise<void> {
		const user = await this._userRepository.findById(input.userId);
		if (!user) {
			throw new UserNotFoundError();
		}

		const updateData: any = {};

		if (input.name) {
			updateData.name = input.name;
		}

		if (input.profilePictureId) {
			updateData.profilePictureId = input.profilePictureId;
		}

		if (input.interests || input.skills) {
			const newInterests = input.interests || user.preferences?.interests || [];
			const newSkills = input.skills || user.preferences?.skills || [];

			if (
				newInterests.length < UserPreferencesLimits.MIN_INTERESTS ||
				newInterests.length > UserPreferencesLimits.MAX_INTERESTS
			) {
				throw new ValidationError();
			}

			if (
				newSkills.length < UserPreferencesLimits.MIN_SKILLS_PER_INTEREST ||
				newSkills.length >
					UserPreferencesLimits.MAX_INTERESTS *
						UserPreferencesLimits.MAX_SKILLS_PER_INTEREST
			) {
				throw new ValidationError();
			}

			updateData.preferences = {
				interests: newInterests,
				skills: newSkills,
			};
		}

		await this._userRepository.updateById(user.id, updateData);
	}
}
