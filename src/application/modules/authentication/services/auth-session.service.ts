import { inject, injectable } from "inversify";
import { Session } from "../../../../domain/entities/session.entity";
import type { User } from "../../../../domain/entities/user.entity";
import type { ISessionRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { formatDeviceString } from "../../../../shared/utilities/device.util";
import {
	type IIdGenerator,
	type IStorageService,
	type ITokenService,
	REFRESH_TOKEN_EXPIRES_IN,
} from "../../../services";
import type { AuthDeviceContext, LoginResponse } from "../dtos";
import { LoginResponseMapper } from "../mappers/login-response.mapper";
import type { IAuthSessionService } from "./auth-session.service.interface";

@injectable()
export class AuthSessionService implements IAuthSessionService {
	constructor(
		@inject(TYPES.Repositories.SessionRepository)
		private readonly _sessionRepository: ISessionRepository,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async createLoginResponse(
		user: User,
		deviceContext: AuthDeviceContext,
	): Promise<LoginResponse> {
		const sessionId = this._idGenerator.generate();
		const refreshTokenId = this._idGenerator.generate();
		const accessTokenId = this._idGenerator.generate();

		const accessToken = this._tokenService.generateAccessToken({
			sub: user.id,
			role: user.role,
			jti: accessTokenId,
			sid: sessionId,
		});

		const refreshToken = this._tokenService.generateRefreshToken({
			sub: user.id,
			jti: refreshTokenId,
			sid: sessionId,
		});

		const refreshTokenHash = this._tokenService.hashToken(refreshToken);
		const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000);

		const session = new Session(
			"",
			sessionId,
			user.id,
			refreshTokenHash,
			expiresAt,
			deviceContext.ipAddress || "unknown",
			deviceContext.userAgent || "unknown",
			formatDeviceString(
				deviceContext.browser,
				deviceContext.deviceVendor,
				deviceContext.deviceModel,
				deviceContext.deviceOs,
			),
			deviceContext.deviceType || "unknown",
			false,
			new Date(),
		);

		await this._sessionRepository.create(session);

		let profilePictureUrl: string | null = null;

		if (user.profilePictureId) {
			profilePictureUrl = this._storageService.getPublicUrl(
				user.profilePictureId,
			);
		}

		return LoginResponseMapper.toDto(
			user,
			accessToken,
			refreshToken,
			profilePictureUrl,
		);
	}
}
