import { randomUUID } from "node:crypto";
import { inject, injectable } from "inversify";
import { Session } from "../../../../domain/entities/session.entity";
import type {
	ISessionRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { UserPreferencesLimits } from "../../../../shared/constants/app.constants";
import { TYPES } from "../../../../shared/types/types";
import { formatDeviceString } from "../../../../shared/utiliites/device.util";
import type { ITokenService } from "../../../services";
import { ValidationError } from "../../../shared/errors/validation-error";
import type {
	SaveUserInterestsInput,
	SaveUserInterestsResponse,
} from "../../dtos/save-user-interests.dto";
import { AuthenticationError } from "../../errors/authentication.error";
import { UserNotFoundError } from "../../errors/user-not-found.error";
import { LoginResponseMapper } from "../../mappers/login-response.mapper";
import type { ISaveUserInterestsUseCase } from "./save-user-interests.usecase.interface";

@injectable()
export class SaveUserInterestsUseCase implements ISaveUserInterestsUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.SessionRepository)
		private readonly _sessionRepository: ISessionRepository,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
	) {}

	async execute(
		input: SaveUserInterestsInput,
	): Promise<SaveUserInterestsResponse> {
		const { sub: userId } = this._tokenService.verifySetupToken(
			input.setupToken,
		);
		if (!userId) throw new AuthenticationError();

		const user = await this._userRepository.findById(userId);
		if (!user) throw new UserNotFoundError();

		if (
			input.interests.length < UserPreferencesLimits.MIN_INTERESTS ||
			input.interests.length > UserPreferencesLimits.MAX_INTERESTS
		) {
			throw new ValidationError();
		}

		if (
			input.skills.length < UserPreferencesLimits.MIN_SKILLS_PER_INTEREST ||
			input.skills.length > UserPreferencesLimits.MAX_SKILLS_PER_INTEREST
		) {
			throw new ValidationError();
		}

		const updatedUser = await this._userRepository.updateById(user.id, {
			preferences: {
				interests: input.interests,
				skills: input.skills,
			},
		});

		const finalUser = updatedUser || user;

		const refreshTokenId = randomUUID();
		const accessTokenId = randomUUID();
		const sessionId = randomUUID();

		const accessToken = this._tokenService.generateAccessToken({
			sub: finalUser.id,
			role: finalUser.role,
			jti: accessTokenId,
			sid: sessionId,
		});

		const refreshToken = this._tokenService.generateRefreshToken({
			sub: finalUser.id,
			jti: refreshTokenId,
			sid: sessionId,
		});

		const refreshTokenHash = this._tokenService.hashToken(refreshToken);
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		const session = new Session(
			"",
			sessionId,
			finalUser.id,
			refreshTokenHash,
			expiresAt,
			input.ipAddress || "unknown",
			input.userAgent || "unknown",
			formatDeviceString(input.deviceVendor, input.deviceModel, input.deviceOs),
			input.deviceType || "unknown",
			false,
			new Date(),
		);

		await this._sessionRepository.create(session);

		// dummy profile picture url
		const tempProfilePictureUrl = "https://picsum.photos/200";

		return LoginResponseMapper.toDto(
			finalUser,
			accessToken,
			refreshToken,
			tempProfilePictureUrl,
		);
	}
}
