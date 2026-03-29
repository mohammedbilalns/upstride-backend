import { inject, injectable } from "inversify";
import { Session } from "../../../../../domain/entities/session.entity";
import type {
	ISessionRepository,
	IUserRepository,
} from "../../../../../domain/repositories";
import { UserPreferencesLimits } from "../../../../../shared/constants/app.constants";
import { TYPES } from "../../../../../shared/types/types";
import { formatDeviceString } from "../../../../../shared/utilities/device.util";
import {
	type ITokenService,
	REFRESH_TOKEN_EXPIRES_IN,
} from "../../../../services";
import type { IIdGenerator } from "../../../../services/id-generator.service.interface";
import type { IStorageService } from "../../../../services/storage.service.interface";
import { ValidationError } from "../../../../shared/errors/validation-error";
import type {
	SaveUserInterestsInput,
	SaveUserInterestsResponse,
} from "../../dtos";
import { UserNotFoundError } from "../../errors";
import { AuthenticationError } from "../../errors/authentication.error";
import { LoginResponseMapper } from "../../mappers/login-response.mapper";
import type { ISaveUserInterestsUseCase } from ".";

@injectable()
export class SaveUserInterestsUseCase implements ISaveUserInterestsUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.SessionRepository)
		private readonly _sessionRepository: ISessionRepository,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
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
			input.skills.length >
				UserPreferencesLimits.MAX_INTERESTS *
					UserPreferencesLimits.MAX_SKILLS_PER_INTEREST
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

		const refreshTokenId = this._idGenerator.generate();
		const accessTokenId = this._idGenerator.generate();
		const sessionId = this._idGenerator.generate();

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
		const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000);

		const session = new Session(
			"",
			sessionId,
			finalUser.id,
			refreshTokenHash,
			expiresAt,
			input.ipAddress || "unknown",
			input.userAgent || "unknown",
			formatDeviceString(
				input.browser,
				input.deviceVendor,
				input.deviceModel,
				input.deviceOs,
			),
			input.deviceType || "unknown",
			false,
			new Date(),
		);

		await this._sessionRepository.create(session);

		let profilePictureUrl: string | null = null;
		if (finalUser.profilePictureId) {
			profilePictureUrl = this._storageService.getPublicUrl(
				finalUser.profilePictureId,
			);
		}

		return LoginResponseMapper.toDto(
			finalUser,
			accessToken,
			refreshToken,
			profilePictureUrl,
		);
	}
}
