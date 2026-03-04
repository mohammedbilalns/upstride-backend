import { inject, injectable } from "inversify";
import {
	AuthTypeValues,
	type User,
	UserRoleValues,
} from "../../../../domain/entities/user.entity";
import { RegisterOtpMailTemplate } from "../../../../domain/mail/register-otp-mail.template";
import { RegisterOtpPolicy } from "../../../../domain/policies/register-otp.policy";
import type { IUserRepository } from "../../../../domain/repositories";
import type { IOtpRepository } from "../../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IHasherService, IOtpGenerator } from "../../../services";
import type { IMailService } from "../../../services/mail.service.interface";
import type { RegisterWithEmailInput } from "../../dtos/registration.dto";
import { UserAlreadyExistsError } from "../../errors/user-already-exists.error";
import type { IRegisterWithEmailUseCase } from "./register-with-email.usecase.interface";

@injectable()
export class RegisterWithEmailUseCase implements IRegisterWithEmailUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
		@inject(TYPES.Repositories.OtpRepository)
		private _otpRepository: IOtpRepository,
		@inject(TYPES.Services.Hasher)
		private _passwordHasherService: IHasherService,
		@inject(TYPES.Services.OtpGenerator)
		private _otpGeneratorService: IOtpGenerator,
		@inject(TYPES.Services.MailService)
		private _mailService: IMailService,
	) {}

	async execute(input: RegisterWithEmailInput): Promise<void> {
		const existingUser = await this._userRepository.findByEmail(input.email);

		if (existingUser?.isVerified) throw new UserAlreadyExistsError();

		if (existingUser?.isVerified === false) {
			await this._userRepository.deleteById(existingUser.id);
		}

		const hashedPassword = await this._passwordHasherService.hash(
			input.password,
		);

		const newUser = {
			name: input.name,
			email: input.email,
			phone: input.phone,
			passwordHash: hashedPassword,
			authType: AuthTypeValues[0],
			profilePictureId: null,
			role: UserRoleValues[0],
			isBlocked: false,
			isVerified: false,
		} as User;

		const createdUser = await this._userRepository.create(newUser);

		const policy = new RegisterOtpPolicy();
		const otp = this._otpGeneratorService.generate(6);

		await Promise.all([
			this._otpRepository.saveCode(
				createdUser.id,
				policy.purpose,
				otp,
				policy.ttl,
			),
			this._mailService.send(createdUser.email, new RegisterOtpMailTemplate(), {
				name: createdUser.name,
				otp,
			}),
		]);
	}
}
