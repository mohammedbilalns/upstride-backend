import { inject, injectable } from "inversify";
import { RegisterOtpPolicy } from "../../../domain/policies/register-otp.policy";
import { ResetPasswordOtpPolicy } from "../../../domain/policies/reset-password-otp.policy";
import type { IUserRepository } from "../../../domain/repositories";
import type { IOtpRepository } from "../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { ITokenService } from "../../services";
import type { VerifyOtpInput, VerifyOtpResponse } from "../dtos/verify-otp.dto";
import { InvalidOtpError } from "../errors/invalid-otp.error";
import { UserNotFoundError } from "../errors/user-not-found.error";
import type { IVerifyOtpUseCase } from "./verify-otp.usecase.interface";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
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

			const setupToken = this._tokenService.generateSetupToken({
				sub: finalUser.id,
			});

			return {
				setupToken,
			};
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
