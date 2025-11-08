import { ErrorMessage, HttpStatus, QueueEvents } from "../../common/enums";
import type { IEventBus } from "../../domain/events/IEventBus";
import type { IUserRepository } from "../../domain/repositories";
import type { ICryptoService } from "../../domain/services";
import type { IProfileService } from "../../domain/services/profile.service.interface";
import type {
	changePasswordDto,
	fetchProfileResponseDto,
	updateProfileDto,
} from "../dtos/profile.dto";
import { AppError } from "../errors/AppError";

export class ProfileService implements IProfileService {
	constructor(
		private _userRepository: IUserRepository,
		private _cryptoService: ICryptoService,
		private _eventBus: IEventBus,
	) {}

	async fetchProfileById(profileId: string): Promise<fetchProfileResponseDto> {
		const user = await this._userRepository.findByUserId(profileId);
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		// NOTE: Type checking is added 
		if (typeof user !== "object" || !("isVerified" in user))
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		if (!user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		const { passwordHash, isBlocked, ...userData } = user;
		if (!passwordHash) userData.isVerified = false;
		return { ...userData };
	}

	async updateProfile(userId: string, data: updateProfileDto): Promise<void> {
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
		console.log("profile pic", JSON.stringify(profilePicture));

		if (!newUser)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		if (data.name || data.profilePicture) {
			const { name, profilePicture } = newUser;
			console.log("Before publishing event ");
			this._eventBus.publish(QueueEvents.UPDATE_PROFILE, {
				userId: user.id,
				name,
				profilePicture,
			});
			console.log("After publishing event ");
		}
	}

	async changePassword(userId: string, data: changePasswordDto): Promise<void> {
		const { oldPassword, newPassword } = data;
		console.log(oldPassword, newPassword);

		const user = await this._userRepository.findById(userId);

		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		if (!user.passwordHash)
			throw new AppError(
				ErrorMessage.REGISTERED_WITH_GOOGLE_ID,
				HttpStatus.FORBIDDEN,
			);
		const validOldPassword = await this._cryptoService.compare(
			oldPassword,
			user.passwordHash,
		);
		console.log(validOldPassword);
		if (!validOldPassword)
			throw new AppError(
				ErrorMessage.INVALID_PASSWORD,
				HttpStatus.UNAUTHORIZED,
			);
		const hashedPassword = await this._cryptoService.hash(newPassword);
		await this._userRepository.update(userId, { passwordHash: hashedPassword });
	}
}
