import { inject, injectable } from "inversify";
import { ChangePasswordOtpPolicy } from "../../../../domain/policies/change-password-otp.policy";
import type { IUserRepository } from "../../../../domain/repositories";
import type { IOtpRepository } from "../../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { JobQueuePort } from "../../../ports/job-queue.port";
import type { IOtpGenerator } from "../../../services";
import type { IPasswordService } from "../../../services/password.service.interface";
import type { RequestChangePasswordInput } from "../../authentication/dtos";
import {
	InvalidPasswordError,
	MaxResendsExceededError,
	UserNotFoundError,
} from "../../authentication/errors";
import type { IRequestChangePasswordUseCase } from "./request-change-password.usecase.interface";

@injectable()
export class RequestChangePasswordUseCase
	implements IRequestChangePasswordUseCase
{
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.OtpRepository)
		private readonly _otpRepository: IOtpRepository,
		@inject(TYPES.Services.OtpGenerator)
		private readonly _otpGeneratorService: IOtpGenerator,
		@inject(TYPES.Services.JobQueue)
		private readonly _jobQueue: JobQueuePort,
		@inject(TYPES.Services.Password)
		private readonly _passwordService: IPasswordService,
	) {}

	async execute(input: RequestChangePasswordInput): Promise<void> {
		const user = await this._userRepository.findById(input.userId);

		if (!user) {
			throw new UserNotFoundError();
		}

		const isPasswordCorrect = await this._passwordService.verifyPassword(
			input.oldPassword,
			user.passwordHash,
		);

		if (!isPasswordCorrect) {
			throw new InvalidPasswordError();
		}

		const policy = new ChangePasswordOtpPolicy();

		const resends = await this._otpRepository.incrementResends(
			user.id,
			policy.purpose,
			policy.ttl,
		);

		if (resends > policy.maxResends + 1) {
			throw new MaxResendsExceededError();
		}

		await this._otpRepository.resetAttempts(user.id, policy.purpose);
		const otp = this._otpGeneratorService.generate(6);

		await Promise.all([
			this._otpRepository.saveCode(user.id, policy.purpose, otp, policy.ttl),
			this._jobQueue.enqueue("send-change-password-otp-email", {
				to: user.email,
				name: user.name,
				otp,
			}),
		]);
	}
}
