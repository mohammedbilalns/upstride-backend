import { inject, injectable } from "inversify";
import { ResetPasswordOtpPolicy } from "../../../../../domain/policies/reset-password-otp.policy";
import type { IUserRepository } from "../../../../../domain/repositories";
import type { IOtpRepository } from "../../../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../../../shared/types/types";
import type { JobQueuePort } from "../../../../ports/job-queue.port";
import type { IOtpGenerator } from "../../../../services";
import type { ResendResetPasswordOtpInput } from "../../dtos/otp/resend-reset-password-otp.dto";
import { UserNotFoundError } from "../../errors";
import { MaxResendsExceededError } from "../../errors/max-resend-exceeded.error";
import type { IResendResetPasswordOtpUseCase } from "./resend-reset-password-otp.usecase.interface";

@injectable()
export class ResendResetPasswordOtpUseCase
	implements IResendResetPasswordOtpUseCase
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
	) {}

	async execute(input: ResendResetPasswordOtpInput): Promise<void> {
		const user = await this._userRepository.findByEmail(input.email);
		if (!user) throw new UserNotFoundError();

		const policy = new ResetPasswordOtpPolicy();

		const resends = await this._otpRepository.incrementResends(
			user.id,
			policy.purpose,
			policy.ttl,
		);

		if (resends > policy.maxResends) {
			throw new MaxResendsExceededError();
		}

		await this._otpRepository.resetAttempts(user.id, policy.purpose);
		const otp = this._otpGeneratorService.generate(6);

		await Promise.all([
			this._otpRepository.saveCode(user.id, policy.purpose, otp, policy.ttl),
			this._jobQueue.enqueue("send-reset-password-otp-email", {
				to: user.email,
				otp,
			}),
		]);
	}
}
