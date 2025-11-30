import { ErrorMessage, HttpStatus, QueueEvents } from "../../../common/enums";
import { IEventBus } from "../../../domain/events/IEventBus";
import { IUserRepository } from "../../../domain/repositories";
import { IUpdateProfileUC } from "../../../domain/useCases/profileMangement/updateProfile.uc.interface";
import { updateProfileDto } from "../../dtos/profile.dto";
import { AppError } from "../../errors/AppError";

export class UpdateProfileUC implements IUpdateProfileUC {
	constructor(
		private _userRepository: IUserRepository,
		private _eventBus: IEventBus,
	) {}

	async execute(userId: string, data: updateProfileDto): Promise<void> {
		if (userId !== data.id)
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		const user = await this._userRepository.findById(userId);
		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		const { profilePicture, ...profileData } = data;

		const newUser = await this._userRepository.update(userId, {
			...profileData,
			profilePicture: profilePicture?.secure_url,
			profilePictureId: profilePicture?.public_id,
		});

		if (!newUser)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		if (data.name || data.profilePicture) {
			const { name, profilePicture } = newUser;
			this._eventBus.publish(QueueEvents.UPDATE_PROFILE, {
				userId: user.id,
				name,
				profilePicture,
			});
		}
	}
}
