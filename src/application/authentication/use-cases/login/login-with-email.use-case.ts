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
import type { IStorageService } from "../../../services/storage.service.interface";
import type { LoginResponse, LoginWithEmailInput } from "../../dtos/login.dto";
import { AuthenticationError } from "../../errors/authentication.error";
import { LoginResponseMapper } from "../../mappers/login-response.mapper";
import {
	assertAuthEligibility,
	getAuthEligibility,
} from "../helpers/assert-user-can-authenticate";
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
		@inject(TYPES.Services.Storage) private _storageService: IStorageService,
	) {}

	async execute(input: LoginWithEmailInput): Promise<LoginResponse> {
		const existingUser = await this._userRepository.findByEmail(input.email);

		if (!existingUser) {
			await this._hasherService.fakeCompare();
			throw new AuthenticationError();
		}

		const eligibility = getAuthEligibility(existingUser);

		if (eligibility === "unverified") {
			await this._hasherService.fakeCompare();
		}

		assertAuthEligibility(eligibility);

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

		let profilePictureUrl: string | null = null;
		if (existingUser.profilePictureId) {
			profilePictureUrl = await this._storageService.getSignedUrl(
				existingUser.profilePictureId,
			);
		}

		return LoginResponseMapper.toDto(
			existingUser,
			accessToken,
			refreshToken,
			profilePictureUrl,
		);
	}
}
