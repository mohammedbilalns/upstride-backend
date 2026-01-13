import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IUserRepository } from "../../../domain/repositories";
import { IFetchProfileUC } from "../../../domain/useCases/profileMangement/fetch-profile.uc.interface";
import { fetchProfileResponseDto } from "../../dtos/profile.dto";
import { AppError } from "../../errors/app-error";

export class FetchProfileUC implements IFetchProfileUC {
	constructor(private _userRepository: IUserRepository) {}

	async execute(userId: string): Promise<fetchProfileResponseDto> {
		const user = await this._userRepository.findByUserId(userId);
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		if (typeof user !== "object" || !("isVerified" in user))
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		if (!user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		const { passwordHash, isBlocked, ...userData } = user;
		if (!passwordHash) userData.isVerified = false;
		return { ...userData };
	}
}
