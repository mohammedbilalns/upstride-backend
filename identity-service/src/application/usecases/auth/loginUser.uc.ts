import { CACHE_TTL } from "../../../common/constants/cacheOptions";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { UserRole } from "../../../common/enums/userRoles";
import {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { ICryptoService, ITokenService } from "../../../domain/services";
import { ICacheService } from "../../../domain/services/cache.service.interface";
import { ILoginUserUC } from "../../../domain/useCases/auth/loginUser.uc.interface";
import { LoginReturn, LoginUserDto } from "../../dtos/auth.dto";
import { AppError } from "../../errors/AppError";

export class LoginUserUC implements ILoginUserUC {
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
		private _cacheService: ICacheService,
		private _cryptoService: ICryptoService,
		private _tokenService: ITokenService,
	) {}

	/**
	 * Validates user credentials and returns access/refresh tokens.
	 * Also caches lightweight user data.
	 */
	async execute(loginDetails: LoginUserDto): Promise<LoginReturn> {
		const { email, password } = loginDetails;
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

		let mentorId: string | undefined;

		if (user.role === UserRole.MENTOR) {
			const mentor = await this._mentorRepository.findByUserId(user.id);
			mentorId = mentor?.id;
		}

		// generate tokens
		return {
			accessToken: this._tokenService.generateAccessToken({
				...user,
				mentorId,
			}),
			refreshToken: this._tokenService.generateRefreshToken(user),
			user: publicUser,
		};
	}
}
