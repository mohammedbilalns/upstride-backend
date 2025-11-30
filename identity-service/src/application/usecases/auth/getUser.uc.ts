import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IUserRepository } from "../../../domain/repositories";
import { IGetUserUC } from "../../../domain/useCases/auth/getUser.uc.interface";
import { UserDTO } from "../../dtos";
import { AppError } from "../../errors/AppError";

export class GetUserUC implements IGetUserUC {
	constructor(private _userRepository: IUserRepository) {}

	async execute(userId: string): Promise<UserDTO> {
		const user = await this._userRepository.findById(userId);
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
		if (user?.isBlocked)
			throw new AppError(
				ErrorMessage.BLOCKED_FROM_PLATFORM,
				HttpStatus.FORBIDDEN,
			);
		const { passwordHash, isBlocked, isVerified, googleId, ...publicUser } =
			user;
		return publicUser;
	}
}
