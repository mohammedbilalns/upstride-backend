import { MAX_OTP_ATTEMPTS } from "../../../common/constants/otpConfig";
import { ErrorMessage, HttpStatus, QueueEvents } from "../../../common/enums";
import { MailType } from "../../../common/enums/mail-types";
import { IEventBus } from "../../../domain/events/IEventBus";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { IResendResetOtpUC } from "../../../domain/useCases/resetUserPassword/resend-reset-otp.uc.interface";
import { AppError } from "../../errors/app-error";
import { generateOtp } from "../../utils/generateOtp";
import { OTP_SUBJECT, otpType } from "../../utils/mail.util";

export class ResendResetOtpUC implements IResendResetOtpUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _eventBus: IEventBus,
	) {}

	/**
	 * Resends password reset OTP with retry limit protection.
	 * 1. Validate user
	 * 2. Enforce resend limit
	 * 3. Generate new OTP
	 * 4. Persist OTP and publish SEND_MAIL event
	 */
	async execute(email: string): Promise<void> {
		const user = await this._userRepository.findByEmail(email);
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		// Check how many times the OTP has been resent already
		const count =
			(await this._verficationTokenRepository.getResendCount(
				email,
				otpType.reset,
			)) ?? 0;

		// Block further OTP requests if retry threshold is exceeded
		if (count > MAX_OTP_ATTEMPTS) {
			await this._verficationTokenRepository.deleteOtp(email, otpType.reset);
			throw new AppError(
				ErrorMessage.TOO_MANY_OTP_ATTEMPTS,
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}

		// Generate a fresh OTP
		const otp = generateOtp();
		const message = {
			to: email,
			subject: OTP_SUBJECT,
			mailType: MailType.PASSWORD_RESET_OTP,
			otp,
		};

		// Persist the OTP and publish mail event
		await Promise.all([
			this._verficationTokenRepository.updateOtp(otp, email, otpType.reset),
			this._eventBus.publish(QueueEvents.SEND_MAIL, message),
		]);
	}
}
