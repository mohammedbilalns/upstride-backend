import { CACHE_TTL } from "../../../common/constants/cacheOptions";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { UserRole } from "../../../common/enums/userRoles";
import {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { ITokenService } from "../../../domain/services";
import { ICacheService } from "../../../domain/services/cache.service.interface";
import { IRefreshTokenUC } from "../../../domain/useCases/auth/refreshToken.uc.interface";
import { AppError } from "../../errors/AppError";
import { RefreshTokenDto } from "../../dtos/auth.dto";

export class RefreshTokenUC implements IRefreshTokenUC {
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
		private _tokenService: ITokenService,
		private _cacheService: ICacheService,
	) {}

	/**
	 * Generates new access & refresh tokens using a valid refresh token.
	 * responsibilities:
	 *  1. Verify provided refresh token
	 *  2. Validate user existence and status
	 *  3. Issue new access + refresh tokens
	 *  4. Cache user info for
	 */
	async execute(
		dto: RefreshTokenDto,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const { refreshToken } = dto;
		// validate and decode refresh token
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

		let mentorId: string | undefined;

		if (user.role === UserRole.MENTOR) {
			const mentor = await this._mentorRepository.findByUserId(user.id);
			mentorId = mentor?.id;
		}
		// generate new tokens
		const { newAccessToken, newRefreshToken } =
			await this._tokenService.generateTokens({ ...user, mentorId });

		// cache user info
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
