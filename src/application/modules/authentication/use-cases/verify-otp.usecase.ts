import { inject, injectable } from "inversify";
import { UserRegisteredEvent } from "../../../../domain/events/user-registered.event";
import { ChangePasswordOtpPolicy } from "../../../../domain/policies/change-password-otp.policy";
import type { IOtpPolicy } from "../../../../domain/policies/otp.policy";
import { RegisterOtpPolicy } from "../../../../domain/policies/register-otp.policy";
import { ResetPasswordOtpPolicy } from "../../../../domain/policies/reset-password-otp.policy";
import type { IUserRepository } from "../../../../domain/repositories";
import type { IOtpRepository } from "../../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { EventBus } from "../../../events/event-bus.interface";
import type { ITokenService } from "../../../services";
import type { VerifyOtpInput, VerifyOtpResponse } from "../dtos";
import { InvalidOtpError } from "../errors/invalid-otp.error";
import { MaxAttemptsExceededError } from "../errors/max-attempts-exceeded.error";
import { UserNotFoundError } from "../errors/user-not-found.error";
import type { IVerifyOtpUseCase } from "./verify-otp.usecase.interface";

//FIX: violates SRP convert to seperate use cases
@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.OtpRepository)
		private readonly _otpRepository: IOtpRepository,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
		@inject(TYPES.Services.EventBus)
		private readonly _eventBus: EventBus,
	) {}

	async execute(input: VerifyOtpInput): Promise<VerifyOtpResponse> {
		const user = await this._userRepository.findByEmail(input.email);
		if (!user) throw new UserNotFoundError();

		let policy: IOtpPolicy;
		if (input.type === "REGISTER") {
			policy = new RegisterOtpPolicy();
		} else if (input.type === "RESET_PASSWORD") {
			policy = new ResetPasswordOtpPolicy();
		} else if (input.type === "CHANGE_PASSWORD") {
			policy = new ChangePasswordOtpPolicy();
		} else {
			throw new Error("Invalid OTP type");
		}

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

		if (input.type === "REGISTER") {
			const updatedUser = await this._userRepository.updateById(user.id, {
				isVerified: true,
			});

			const finalUser = updatedUser || user;

			await this._eventBus.publish(
				new UserRegisteredEvent(finalUser.id, finalUser.email),
			);

			const setupToken = this._tokenService.generateSetupToken({
				sub: finalUser.id,
			});

			return {
				setupToken,
			};
		} else if (
			input.type === "RESET_PASSWORD" ||
			input.type === "CHANGE_PASSWORD"
		) {
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
