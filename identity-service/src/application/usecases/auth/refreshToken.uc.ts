import { CACHE_TTL } from "../../../common/constants/cacheOptions";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IUserRepository } from "../../../domain/repositories";
import { ITokenService } from "../../../domain/services";
import { ICacheService } from "../../../domain/services/cache.service.interface";
import { IRefreshTokenUC } from "../../../domain/useCases/auth/refreshToken.uc.interface";
import { AppError } from "../../errors/AppError";

export class RefreshTokenUC implements IRefreshTokenUC {
	constructor(
		private _userRepository: IUserRepository,
		private _tokenService: ITokenService,
		private _cacheService: ICacheService,
	) {}
	async execute(
		refreshToken: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const decoded = this._tokenService.verifyRefreshToken(refreshToken);
		const { id } = decoded;
		const user = await this._userRepository.findById(id);
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
		if (user?.isBlocked)
			throw new AppError(
				ErrorMessage.BLOCKED_FROM_PLATFORM,
				HttpStatus.FORBIDDEN,
			);

		const { newAccessToken, newRefreshToken } =
			await this._tokenService.generateTokens(user);
		this._cacheService.set(
			`user:${user.id}`,
			{ id: user.id, profilePicture: user.profilePicture, name: user.name },
			CACHE_TTL,
		);
		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		};
	}
}
