import { ErrorMessage, HttpStatus, QueueEvents } from "../../../common/enums";
import { MailType } from "../../../common/enums/mailTypes";
import { IEventBus } from "../../../domain/events/IEventBus";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { ICryptoService } from "../../../domain/services";
import { IRegisterUserUC } from "../../../domain/useCases/userRegistration/registerUser.uc.interface";
import { RegisterUserDto } from "../../dtos/registration.dto";
import { AppError } from "../../errors/AppError";
import { generateOtp } from "../../utils/generateOtp";
import { OTP_SUBJECT, otpType } from "../../utils/mail.util";
import { OTP_EXPIRY_TIME } from "../../../common/constants/otpConfig";

/**
 * RegisterUser Use Case
 * Handles user signup, stores hashed password,
 * generates OTP and triggers email event for verification.
 */
export class RegisterUserUC implements IRegisterUserUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _cryptoService: ICryptoService,
		private _eventBus: IEventBus,
	) {}

	async execute(registrationData: RegisterUserDto): Promise<void> {
		// verify the user doesn't exist
		const existingUser = await this._userRepository.findByEmail(
			registrationData.email,
		);
		if (existingUser?.isVerified)
			throw new AppError(
				ErrorMessage.EMAIL_ALREADY_EXISTS,
				HttpStatus.BAD_REQUEST,
			);

		if (existingUser && !existingUser?.isVerified)
			await this._userRepository.delete(existingUser.id);

		// hash the password
		const hashedPassword = await this._cryptoService.hash(
			registrationData.password,
		);
		// create the user
		await this._userRepository.create({
			email: registrationData.email,
			phone: registrationData.phone,
			name: registrationData.name,
			passwordHash: hashedPassword,
		});
		// generate and save the OTP
		const otp = generateOtp();
		await this._verficationTokenRepository.saveOtp(
			otp,
			registrationData.email,
			otpType.register,
			OTP_EXPIRY_TIME,
		);
		// send the OTP to the user
		const emailMessage = {
			to: registrationData.email,
			subject: OTP_SUBJECT,
			mailType: MailType.REGISTER_OTP,
			otp: otp,
		};
		await this._eventBus.publish(QueueEvents.SEND_MAIL, emailMessage);
	}
}
