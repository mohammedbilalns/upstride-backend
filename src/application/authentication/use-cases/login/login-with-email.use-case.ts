import { randomUUID } from "node:crypto";
import { inject, injectable } from "inversify";
import { Session } from "../../../../domain/entities/session.entity";
import type {
	ISessionRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { formatDeviceString } from "../../../../shared/utiliites/device.util";
import {
	type IHasherService,
	type ITokenService,
	REFRESH_TOKEN_EXPIRES_IN,
} from "../../../services";
import type { LoginResponse, LoginWithEmailInput } from "../../dtos/login.dto";
import { AuthenticationError } from "../../errors/authentication.error";
import { UserBlockedError } from "../../errors/user-blocked.error";
import { LoginResponseMapper } from "../../mappers/login-response.mapper";
import type { ILoginWithEmailUseCase } from "./login-with-email.usecase.interface";

@injectable()
export class LoginWithEmailUseCase implements ILoginWithEmailUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
		@inject(TYPES.Repositories.SessionRepository)
		private _sessionRepository: ISessionRepository,
		@inject(TYPES.Services.Hasher)
		private _hasherService: IHasherService,
		@inject(TYPES.Services.TokenService) private _tokenService: ITokenService,
	) {}

	async execute(input: LoginWithEmailInput): Promise<LoginResponse> {
		const existingUser = await this._userRepository.findByEmail(input.email);

		if (!existingUser) {
			await this._hasherService.fakeCompare();
			throw new AuthenticationError();
		}

		if (existingUser.isBlocked) {
			throw new UserBlockedError();
		}
		if (!existingUser.isVerified) {
			await this._hasherService.fakeCompare();
			throw new AuthenticationError();
		}

		const isPasswordCorrect = await this._hasherService.compare(
			input.password,
			existingUser.passwordHash,
		);

		if (!isPasswordCorrect) throw new AuthenticationError();

		const sessionId = randomUUID();
		const refreshTokenId = randomUUID();
		const accessTokenId = randomUUID();

		const accessToken = this._tokenService.generateAccessToken({
			sub: existingUser.id,
			role: existingUser.role,
			jti: accessTokenId,
			sid: sessionId,
		});

		const refreshToken = this._tokenService.generateRefreshToken({
			sub: existingUser.id,
			jti: refreshTokenId,
			sid: sessionId,
		});

		const refreshTokenHash = this._tokenService.hashToken(refreshToken);
		const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000);

		const session = new Session(
			"",
			sessionId,
			existingUser.id,
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

		//TODO: fetch secure profile picture url and send it instead
		const tempProfilePictureUrl: string = "https://picsum.photos/200";

		return LoginResponseMapper.toDto(
			existingUser,
			accessToken,
			refreshToken,
			tempProfilePictureUrl,
		);
	}
}
