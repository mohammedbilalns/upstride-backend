import { inject, injectable } from "inversify";
import { ResetPasswordOtpPolicy } from "../../../../../domain/policies/reset-password-otp.policy";
import type { IUserRepository } from "../../../../../domain/repositories";
import type { IOtpRepository } from "../../../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../../../shared/types/types";
import type { ITokenService } from "../../../../services";
import type { VerifyOtpResponse } from "../../dtos";
import type { VerifyResetPasswordOtpInput } from "../../dtos/otp/verify-reset-password-otp.dto";
import { UserNotFoundError } from "../../errors";
import { InvalidOtpError } from "../../errors/invalid-otp.error";
import { MaxAttemptsExceededError } from "../../errors/max-attempts-exceeded.error";
import type { IVerifyResetPasswordOtpUseCase } from "./verify-reset-password-otp.usecase.interface";

@injectable()
export class VerifyResetPasswordOtpUseCase
	implements IVerifyResetPasswordOtpUseCase
{
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.OtpRepository)
		private readonly _otpRepository: IOtpRepository,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
	) {}

	async execute(
		input: VerifyResetPasswordOtpInput,
	): Promise<VerifyOtpResponse> {
		const user = await this._userRepository.findByEmail(input.email);
		if (!user) throw new UserNotFoundError();

		const policy = new ResetPasswordOtpPolicy();

		const currentAttempts = await this._otpRepository.getAttempts(
			user.id,
			policy.purpose,
		);

		if (currentAttempts >= policy.maxAttempts) {
			throw new MaxAttemptsExceededError();
		}

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
				throw new MaxAttemptsExceededError();
			}
			throw new InvalidOtpError();
		}

		await this._otpRepository.deleteAll(user.id, policy.purpose);

		const resetToken = this._tokenService.generateResetToken({
			sub: user.id,
		});

		return {
			resetToken,
		};
	}
}
