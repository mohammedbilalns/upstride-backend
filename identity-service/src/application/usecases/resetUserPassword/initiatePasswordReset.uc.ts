import { OTP_EXPIRY_TIME } from "../../../common/constants/otpConfig";
import { ErrorMessage, HttpStatus, QueueEvents } from "../../../common/enums";
import { MailType } from "../../../common/enums/mailTypes";
import { IEventBus } from "../../../domain/events/IEventBus";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { IInitiatePasswordResetUC } from "../../../domain/useCases/resetUserPassword/initiatePasswordReset.uc.interface";
import { AppError } from "../../errors/AppError";
import { generateOtp } from "../../utils/generateOtp";
import { OTP_SUBJECT, otpType } from "../../utils/mail.util";

export class InitiatePasswordResetUC implements IInitiatePasswordResetUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _eventBus: IEventBus,
	) {}

	/**
	 * Starts the password reset flow.
	 * Generates an OTP, stores it, and triggers a password reset email event.
	 */
	async execute(email: string): Promise<void> {
		// validate user identity
		const user = await this._userRepository.findByEmail(email);
		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		// generate OTP and store it
		const otp = generateOtp();
		await this._verficationTokenRepository.saveOtp(
			otp,
			email,
			otpType.reset,
			OTP_EXPIRY_TIME,
		);

		// trigger password reset email event
		const message = {
			to: email,
			subject: OTP_SUBJECT,
			mailType: MailType.PASSWORD_RESET_OTP,
			otp,
		};
		await this._eventBus.publish(QueueEvents.SEND_MAIL, message);
	}
}
