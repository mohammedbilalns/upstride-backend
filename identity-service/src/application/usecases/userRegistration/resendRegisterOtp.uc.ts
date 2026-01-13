import { RESEND_LIMIT } from "../../../common/constants/otpConfig";
import { ErrorMessage, HttpStatus, QueueEvents } from "../../../common/enums";
import { MailType } from "../../../common/enums/mailTypes";
import { IEventBus } from "../../../domain/events/IEventBus";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { IResendRegisterOtpUC } from "../../../domain/useCases/userRegistration/resendRegisterOtp.uc.interface";
import { AppError } from "../../errors/AppError";
import { generateOtp } from "../../utils/generateOtp";
import { OTP_SUBJECT, otpType } from "../../utils/mail.util";

export class ResendRegisterOtpUC implements IResendRegisterOtpUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _eventBus: IEventBus,
	) {}

	async execute(email: string): Promise<void> {
		const user = await this._userRepository.findByEmailAndRole(email, "user");
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
		const resendAttempts =
			(await this._verficationTokenRepository.getResendCount(
				email,
				otpType.register,
			)) ?? 0;
		if (resendAttempts > RESEND_LIMIT) {
			await this._verficationTokenRepository.deleteOtp(email, otpType.register);
			throw new AppError(
				ErrorMessage.TOO_MANY_OTP_ATTEMPTS,
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}

		const otp = generateOtp();
		await this._verficationTokenRepository.updateOtp(
			otp,
			email,
			otpType.register,
		);
		const emailMessage = {
			to: email,
			subject: OTP_SUBJECT,
			mailType: MailType.REGISTER_OTP,
			otp,
		};
		await this._eventBus.publish(QueueEvents.SEND_MAIL, emailMessage);
	}
}
