import { ErrorMessage, HttpStatus, QueueEvents } from "../../../common/enums";
import { MailType } from "../../../common/enums/mailTypes";
import { IEventBus } from "../../../domain/events/IEventBus";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { ICryptoService } from "../../../domain/services";
import { IRegisterUserUC } from "../../../domain/useCases/userRegistration/registerUser.uc.interface";
import { registerUserParam } from "../../dtos/registration.dto";
import { AppError } from "../../errors/AppError";
import { generateOtp } from "../../utils/generateOtp";
import { OTP_SUBJECT, otpType } from "../../utils/mail.util";

export class RegisterUserUC implements IRegisterUserUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _cryptoService: ICryptoService,
		private _eventBus: IEventBus,
	) {}

	async execute(registerUserParam: registerUserParam): Promise<void> {
		const { name, email, phone, password } = registerUserParam;

		const existingUser = await this._userRepository.findByEmail(email);
		if (existingUser?.isVerified)
			throw new AppError(
				ErrorMessage.EMAIL_ALREADY_EXISTS,
				HttpStatus.BAD_REQUEST,
			);

		if (existingUser && !existingUser?.isVerified)
			await this._userRepository.delete(existingUser.id);

		const hashedPassword = await this._cryptoService.hash(password);
		await this._userRepository.create({
			email,
			phone,
			name,
			passwordHash: hashedPassword,
		});
		const otp = generateOtp();
		await this._verficationTokenRepository.saveOtp(
			otp,
			email,
			otpType.register,
			300,
		);
		const message = {
			to: email,
			subject: OTP_SUBJECT,
			mailType: MailType.REGISTER_OTP,
			otp: otp,
		};
		await this._eventBus.publish(QueueEvents.SEND_MAIL, message);
	}
}
