import { inject, injectable } from "inversify";
import { ProfileUpdatedEvent } from "../../../../domain/events/profile-updated.event";
import type { IUserRepository } from "../../../../domain/repositories";
import { UserPreferencesLimits } from "../../../../shared/constants/app.constants";
import { TYPES } from "../../../../shared/types/types";
import type { EventBus } from "../../../events/event-bus.interface";
import type { IStorageService } from "../../../services/storage.service.interface";
import { ValidationError } from "../../../shared/errors/validation-error";
import { getUserByIdOrThrow } from "../../../shared/utilities/user.util";
import type { UpdateProfileInput } from "../dtos/update-profile.dto";
import type { IUpdateProfileUseCase } from "./update-profile.usecase.interface";

@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
		@inject(TYPES.Services.EventBus)
		private readonly _eventBus: EventBus,
	) {}

	async execute(input: UpdateProfileInput): Promise<void> {
		const user = await getUserByIdOrThrow(this._userRepository, input.userId);

		const updateData: Record<string, unknown> = {};

		const nameChanged = input.name !== undefined && input.name !== user.name;
		const profilePictureChanged =
			input.profilePictureId !== undefined &&
			input.profilePictureId !== user.profilePictureId;

		if (nameChanged) {
			updateData.name = input.name;
		}

		if (profilePictureChanged && input.profilePictureId) {
			if (user.profilePictureId) {
				await this._storageService.delete(user.profilePictureId);
			}
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

		if (user.role === "MENTOR" && (nameChanged || profilePictureChanged)) {
			const updatedName = nameChanged ? (input.name as string) : user.name;
			const profilePictureId = profilePictureChanged
				? (input.profilePictureId as string | null)
				: user.profilePictureId;
			const avatarUrl = profilePictureId
				? this._storageService.getPublicUrl(profilePictureId)
				: "";

			await this._eventBus.publish(
				new ProfileUpdatedEvent(
					user.id,
					nameChanged ? updatedName : undefined,
					profilePictureChanged ? avatarUrl : undefined,
				),
			);
		}
	}
}
