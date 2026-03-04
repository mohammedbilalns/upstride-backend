import { randomUUID } from "node:crypto";
import { inject, injectable } from "inversify";
import { Session } from "../../../domain/entities/session.entity";
import { RegisterOtpPolicy } from "../../../domain/policies/register-otp.policy";
import { ResetPasswordOtpPolicy } from "../../../domain/policies/reset-password-otp.policy";
import type {
	ISessionRepository,
	IUserRepository,
} from "../../../domain/repositories";
import type { IOtpRepository } from "../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { formatDeviceString } from "../../../shared/utiliites/device.util";
import type { ITokenService } from "../../services";
import type { VerifyOtpInput, VerifyOtpResponse } from "../dtos/verify-otp.dto";
import { InvalidOtpError } from "../errors/invalid-otp.error";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { LoginResponseMapper } from "../mappers/login-response.mapper";
import type { IVerifyOtpUseCase } from "./verify-otp.usecase.interface";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.SessionRepository)
		private readonly _sessionRepository: ISessionRepository,
		@inject(TYPES.Repositories.OtpRepository)
		private readonly _otpRepository: IOtpRepository,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
	) {}

	async execute(input: VerifyOtpInput): Promise<VerifyOtpResponse> {
		const user = await this._userRepository.findByEmail(input.email);
		if (!user) throw new UserNotFoundError();

		const policy =
			input.type === "REGISTER"
				? new RegisterOtpPolicy()
				: new ResetPasswordOtpPolicy();

		const storedCode = await this._otpRepository.getCode(
			user.id,
			policy.purpose,
		);

		if (!storedCode || storedCode !== input.otp) {
			const attempts = await this._otpRepository.incrementAttempts(
				user.id,
				policy.purpose,
				policy.ttl,
			);
			if (attempts >= policy.maxAttempts) {
				await this._otpRepository.deleteAll(user.id, policy.purpose);
			}
			throw new InvalidOtpError();
		}

		await this._otpRepository.deleteAll(user.id, policy.purpose);

		if (input.type === "REGISTER") {
			const updatedUser = await this._userRepository.updateById(user.id, {
				isVerified: true,
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
				sessionId,
				finalUser.id,
				refreshTokenHash,
				expiresAt,
				input.ipAddress || "unknown",
				input.userAgent || "unknown",
				formatDeviceString(
					input.deviceVendor,
					input.deviceModel,
					input.deviceOs,
				),
				input.deviceType || "unknown",
				false,
				new Date(),
			);

			await this._sessionRepository.create(session);

			const tempProfilePictureUrl = "https://picsum.photos/200";

			return LoginResponseMapper.toDto(
				finalUser,
				accessToken,
				refreshToken,
				tempProfilePictureUrl,
			);
		} else if (input.type === "RESET_PASSWORD") {
			const resetToken = this._tokenService.generateResetToken({
				sub: user.id,
			});
			return {
				resetToken,
			};
		}

		throw new InvalidOtpError();
	}
}
