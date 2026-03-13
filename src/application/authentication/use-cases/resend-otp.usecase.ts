import { inject, injectable } from "inversify";
import { RegisterOtpMailTemplate } from "../../../domain/mail/register-otp-mail.template";
import { ResetPasswordMailTemplate } from "../../../domain/mail/reset-otp-mail.template";
import { RegisterOtpPolicy } from "../../../domain/policies/register-otp.policy";
import { ResetPasswordOtpPolicy } from "../../../domain/policies/reset-password-otp.policy";
import type { IUserRepository } from "../../../domain/repositories";
import type { IOtpRepository } from "../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { IMailService, IOtpGenerator } from "../../services";
import type { ResendOtpInput } from "../dtos";
import { MaxResendsExceededError } from "../errors/max-resend-exceeded.error";
import { UserNotFoundError } from "../errors/user-not-found.error";
import type { IResendOtpUseCase } from "./resend-otp.usecase.interface";

@injectable()
export class ResendOtpUseCase implements IResendOtpUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.OtpRepository)
		private readonly _otpRepository: IOtpRepository,
		@inject(TYPES.Services.OtpGenerator)
		private readonly _otpGeneratorService: IOtpGenerator,
		@inject(TYPES.Services.MailService)
		private readonly _mailService: IMailService,
	) {}

	async execute(input: ResendOtpInput): Promise<void> {
		const user = await this._userRepository.findByEmail(input.email);
		if (!user) throw new UserNotFoundError();

		const policy =
			input.type === "REGISTER"
				? new RegisterOtpPolicy()
				: new ResetPasswordOtpPolicy();

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
			input.type === "REGISTER"
				? this._mailService.send(user.email, new RegisterOtpMailTemplate(), {
						name: user.name,
						otp,
					})
				: this._mailService.send(user.email, new ResetPasswordMailTemplate(), {
						code: otp,
					}),
		]);
	}
}
