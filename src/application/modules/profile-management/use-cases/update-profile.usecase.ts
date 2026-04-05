import { inject, injectable } from "inversify";
import { UserPreferences } from "../../../../domain/entities/user-preferences.entity";
import { ProfileUpdatedEvent } from "../../../../domain/events/profile-updated.event";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { DurableEventBus } from "../../../events/durable-event-bus.interface";
import type { IStorageService } from "../../../services/storage.service.interface";
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
		@inject(TYPES.Services.DurableEventBus)
		private readonly _eventBus: DurableEventBus,
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

			const prefs = UserPreferences.create(newInterests, newSkills);
			updateData.preferences = prefs.toRaw();
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
				new ProfileUpdatedEvent({
					userId: user.id,
					name: nameChanged ? updatedName : undefined,
					avatarUrl: profilePictureChanged ? avatarUrl : undefined,
				}),
			);
		}
	}
}
