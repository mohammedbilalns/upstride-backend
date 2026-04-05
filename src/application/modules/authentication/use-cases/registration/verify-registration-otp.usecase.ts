import { inject, injectable } from "inversify";
import { UserRegisteredEvent } from "../../../../../domain/events/user-registered.event";
import { RegisterOtpPolicy } from "../../../../../domain/policies/register-otp.policy";
import type { IUserRepository } from "../../../../../domain/repositories";
import type { IOtpRepository } from "../../../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../../../shared/types/types";
import type { IEventBus } from "../../../../events/app-event-bus.interface";
import type { ITokenService } from "../../../../services";
import type { VerifyOtpResponse } from "../../dtos";
import type { VerifyRegistrationOtpInput } from "../../dtos/otp/verify-registration-otp.dto";
import { UserNotFoundError } from "../../errors";
import { InvalidOtpError } from "../../errors/invalid-otp.error";
import { MaxAttemptsExceededError } from "../../errors/max-attempts-exceeded.error";
import type { IVerifyRegistrationOtpUseCase } from "./verify-registration-otp.usecase.interface";

@injectable()
export class VerifyRegistrationOtpUseCase
	implements IVerifyRegistrationOtpUseCase
{
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.OtpRepository)
		private readonly _otpRepository: IOtpRepository,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
		@inject(TYPES.Services.AppEventBus)
		private readonly _eventBus: IEventBus,
	) {}

	async execute(input: VerifyRegistrationOtpInput): Promise<VerifyOtpResponse> {
		const user = await this._userRepository.findByEmail(input.email);
		if (!user) throw new UserNotFoundError();

		const policy = new RegisterOtpPolicy();

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

		const updatedUser = await this._userRepository.updateById(user.id, {
			isVerified: true,
		});

		const finalUser = updatedUser || user;

		await this._eventBus.publish(
			new UserRegisteredEvent({
				userId: finalUser.id,
				email: finalUser.email,
			}),
			{ durable: true },
		);

		const setupToken = this._tokenService.generateSetupToken({
			sub: finalUser.id,
		});

		return {
			setupToken,
		};
	}
}
