import { inject, injectable } from "inversify";
import { ResetPasswordMailTemplate } from "../../../../domain/mail/reset-otp-mail.template";
import { ResetPasswordOtpPolicy } from "../../../../domain/policies/reset-password-otp.policy";
import type { IUserRepository } from "../../../../domain/repositories";
import type { IOtpRepository } from "../../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IOtpGenerator } from "../../../services";
import type { IMailService } from "../../../services/mail.service.interface";
import type { RequestPasswordResetInput } from "../../dtos/reset-password.dto";
import type { IRequestPasswordResetUseCase } from "./request-password-reset.usecase.interface";

@injectable()
export class RequestPasswordResetUseCase
	implements IRequestPasswordResetUseCase
{
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

	async execute(input: RequestPasswordResetInput): Promise<void> {
		const { email } = input;
		const user = await this._userRepository.findByEmail(email);

		if (user) {
			const policy = new ResetPasswordOtpPolicy();
			const otp = this._otpGeneratorService.generate(6);

			await Promise.all([
				this._otpRepository.saveCode(user.id, policy.purpose, otp, policy.ttl),
				this._mailService.send(email, new ResetPasswordMailTemplate(), {
					code: otp,
				}),
			]);
		}
	}
}
