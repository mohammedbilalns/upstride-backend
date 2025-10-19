import { CACHE_TTL } from "../../common/constants/cacheOptions";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import type {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../domain/repositories";
import type {
	IAuthService,
	ICryptoService,
	ITokenService,
} from "../../domain/services";
import type { ICacheService } from "../../domain/services/cache.service.interface";
import type { GoogleAuthResponse } from "../dtos/auth.dto";
import type { UserDTO } from "../dtos/user.dto";
import { AppError } from "../errors/AppError";
import { generateSecureToken } from "../utils/token.util";

export class AuthService implements IAuthService {
	constructor(
		private _userRepository: IUserRepository,
		private _verificationTokenRepository: IVerificationTokenRepository,
		private _cryptoService: ICryptoService,
		private _tokenService: ITokenService,
		private _cacheService: ICacheService,
	) {}

	private async generateTokens(
		user: UserDTO,
	): Promise<{ newAccessToken: string; newRefreshToken: string }> {
		const [newAccessToken, newRefreshToken] = await Promise.all([
			this._tokenService.generateAccessToken(user),
			this._tokenService.generateRefreshToken(user),
		]);
		return { newAccessToken, newRefreshToken };
	}

	async loginUser(
		email: string,
		password: string,
	): Promise<{ accessToken: string; refreshToken: string; user: UserDTO }> {
		const user = await this._userRepository.findByEmail(email);

		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
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
		const isPasswordValid = await this._cryptoService.compare(
			password,
			user.passwordHash,
		);
		if (!isPasswordValid)
			throw new AppError(
				ErrorMessage.INVALID_CREDENTIALS,
				HttpStatus.UNAUTHORIZED,
			);

		this._cacheService.set(
			`user:${user.id}`,
			{ image: user.profilePicture },
			CACHE_TTL,
		);

		const { passwordHash, isBlocked, isVerified, googleId, ...publicUser } =
			user;
		return {
			accessToken: this._tokenService.generateAccessToken(user),
			refreshToken: this._tokenService.generateRefreshToken(user),
			user: publicUser,
		};
	}

	async refreshAccessToken(
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

		const { newAccessToken, newRefreshToken } = await this.generateTokens(user);
		this._cacheService.set(
			`user:${user.id}`,
			{ image: user.profilePicture },
			CACHE_TTL,
		);
		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		};
	}

	async googleAuthenticate(token: string): Promise<GoogleAuthResponse> {
		const decodedToken = this._tokenService.decodeGoogleToken(token);
		if (!decodedToken)
			throw new AppError(ErrorMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);

		let user = await this._userRepository.findByEmail(decodedToken.email);
		if (!user) {
			user = await this._userRepository.create({
				email: decodedToken.email,
				name: decodedToken.name,
				isVerified: false,
				googleId: decodedToken.sub,
				profilePicture: decodedToken.picture,
			});

			const token = generateSecureToken();
			this._verificationTokenRepository.saveToken(
				token,
				decodedToken.email,
				"register",
				15 * 60,
			);
			return { token, email: decodedToken.email };
		} else if (!user.googleId) {
			const { id } = user;
			user = await this._userRepository.update(id, {
				googleId: decodedToken.sub,
			});
			if (!user) {
				throw new AppError(
					ErrorMessage.USER_NOT_FOUND,
					HttpStatus.UNAUTHORIZED,
				);
			}
		}
		const { passwordHash, isBlocked, isVerified, googleId, ...publicUser } =
			user;
		const { newAccessToken, newRefreshToken } = await this.generateTokens(user);
		this._cacheService.set(
			`user:${user.id}`,
			{ image: user.profilePicture },
			CACHE_TTL,
		);
		return {
			user: publicUser,
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		};
	}

	async isUserBlocked(userId: string): Promise<boolean> {
		const user = await this._userRepository.findById(userId);
		return user?.isBlocked || false;
	}

	async getUser(userId: string): Promise<UserDTO> {
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

	async logout(userId: string): Promise<void> {
		await this._cacheService.del(`user:${userId}`);
	}
}
