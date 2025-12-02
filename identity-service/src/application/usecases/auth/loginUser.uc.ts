import { CACHE_TTL } from "../../../common/constants/cacheOptions";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IUserRepository } from "../../../domain/repositories";
import { ICryptoService, ITokenService } from "../../../domain/services";
import { ICacheService } from "../../../domain/services/cache.service.interface";
import { ILoginUserUC } from "../../../domain/useCases/auth/loginUser.uc.interface";
import { LoginReturn } from "../../dtos/registration.dto";
import { AppError } from "../../errors/AppError";

export class LoginUserUC implements ILoginUserUC {
	constructor(
		private _userRepository: IUserRepository,
		private _cacheService: ICacheService,
		private _cryptoService: ICryptoService,
		private _tokenService: ITokenService,
	) {}

	/**
	 * Validates user credentials and returns access/refresh tokens.
	 * Also caches lightweight user data.
	 */
	async execute(email: string, password: string): Promise<LoginReturn> {
		// verify user identity
		const user = await this._userRepository.findByEmail(email);

		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		// prevent user registered only via googleId
		if (user.googleId && !user.passwordHash) {
			throw new AppError(
				ErrorMessage.ALERADY_WITH_GOOGLE_ID,
				HttpStatus.UNAUTHORIZED,
			);
		}
		if (!user.passwordHash)
			throw new AppError(
				ErrorMessage.INVALID_CREDENTIALS,
				HttpStatus.UNAUTHORIZED,
			);
		if (user.isBlocked)
			throw new AppError(
				ErrorMessage.BLOCKED_FROM_PLATFORM,
				HttpStatus.FORBIDDEN,
			);

		// validate password
		const isPasswordValid = await this._cryptoService.compare(
			password,
			user.passwordHash,
		);
		if (!isPasswordValid)
			throw new AppError(
				ErrorMessage.INVALID_CREDENTIALS,
				HttpStatus.UNAUTHORIZED,
			);

		// cache user data
		this._cacheService.set(
			`user:${user.id}`,
			{ id: user.id, profilePicture: user.profilePicture, name: user.name },
			CACHE_TTL,
		);

		const { passwordHash, isBlocked, isVerified, googleId, ...publicUser } =
			user;

		// generate tokens
		return {
			accessToken: this._tokenService.generateAccessToken(user),
			refreshToken: this._tokenService.generateRefreshToken(user),
			user: publicUser,
		};
	}
}
