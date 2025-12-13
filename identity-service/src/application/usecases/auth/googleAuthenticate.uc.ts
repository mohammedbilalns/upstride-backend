import { CACHE_TTL } from "../../../common/constants/cacheOptions";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { UserRole } from "../../../common/enums/userRoles";
import {
	IMentorRepository,
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { ITokenService } from "../../../domain/services";
import { ICacheService } from "../../../domain/services/cache.service.interface";
import { IGoogleAuthenticateUC } from "../../../domain/useCases/auth/googleAuthenticate.uc.interface";
import { GoogleAuthResponse } from "../../dtos";
import { AppError } from "../../errors/AppError";
import { generateSecureToken } from "../../utils/token.util";

export class GoogleAuthenticateUC implements IGoogleAuthenticateUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verificationTokenRepository: IVerificationTokenRepository,
		private _mentorRepository: IMentorRepository,
		private _tokenService: ITokenService,
		private _cacheService: ICacheService,
	) {}

	/**
	 * Handles Google OAuth login / registration flow.
	 * outcomes:
	 *  - New Google user → create user and issue email verification token
	 *  - Existing password-based user → attach Google login to their account
	 *  - Existing Google user → log in and generate platform tokens
	 */
	async execute(token: string): Promise<GoogleAuthResponse> {
		// verify token and credentials
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

			// generte token and save it
			const token = generateSecureToken();
			this._verificationTokenRepository.saveToken(
				token,
				decodedToken.email,
				"register",
				15 * 60,
			);
			return { token, email: decodedToken.email };
		} else if (!user.googleId) {
			// update the user with Google id
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
		let mentorId: string | undefined;

		if (user.role === UserRole.MENTOR) {
			const mentor = await this._mentorRepository.findByUserId(user.id);
			mentorId = mentor?.id;
		}

		// generate tokens
		const { newAccessToken, newRefreshToken } =
			await this._tokenService.generateTokens({ ...user, mentorId });

		// cache user info
		this._cacheService.set(
			`user:${user.id}`,
			{ id: user.id, image: user.profilePicture, name: user.name },
			CACHE_TTL,
		);
		return {
			user: publicUser,
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		};
	}
}
