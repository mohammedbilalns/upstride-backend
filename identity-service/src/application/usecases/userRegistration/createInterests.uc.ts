import { CACHE_TTL } from "../../../common/constants/cacheOptions";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { ITokenService } from "../../../domain/services";
import { ICacheService } from "../../../domain/services/cache.service.interface";
import { ICreateInterestsUC } from "../../../domain/useCases/userRegistration/createInterests.uc.interface";
import {
	createInterestsParam,
	createInterestsReturn,
} from "../../dtos/registration.dto";
import { AppError } from "../../errors/AppError";

export class CreateInterestsUC implements ICreateInterestsUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _cacheService: ICacheService,
		private _tokenService: ITokenService,
	) {}

	async execute(
		createinterestsParams: createInterestsParam,
	): Promise<createInterestsReturn> {
		const { email, expertises, skills, token } = createinterestsParams;
		const [validToken, user] = await Promise.all([
			this._verficationTokenRepository.getToken(token, "register"),
			this._userRepository.findByEmail(email),
		]);

		if (!validToken) {
			throw new AppError(ErrorMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
		}
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		const { newAccessToken, newRefreshToken } =
			await this._tokenService.generateTokens(user);

		await this._userRepository.update(user.id, {
			interestedExpertises: expertises,
			interestedSkills: skills,
			isVerified: true,
		});

		const { passwordHash, isBlocked, isVerified, googleId, ...publicUser } =
			user;

		this._cacheService.set(
			`user:${user.id}`,
			{ id: user.id, profilePicture: user.profilePicture, name: user.name },
			CACHE_TTL,
		);

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			user: publicUser,
		};
	}
}
