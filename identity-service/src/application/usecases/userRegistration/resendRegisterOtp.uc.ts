import { ErrorMessage, HttpStatus, QueueEvents } from "../../../common/enums";
import { IEventBus } from "../../../domain/events/IEventBus";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { IResendRegisterOtpUC } from "../../../domain/useCases/userRegistration/resendRegisterOtp.uc.interface";
import { AppError } from "../../errors/AppError";
import { generateOtp } from "../../utils/generateOtp";
import { buildOtpEmailHtml, OTP_SUBJECT, otpType } from "../../utils/otp.util";

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
		const count =
			(await this._verficationTokenRepository.getResendCount(
				email,
				otpType.register,
			)) ?? 0;
		if (count > 3) {
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
		const message = {
			to: email,
			subject: OTP_SUBJECT,
			text: buildOtpEmailHtml(otp, otpType.register),
		};
		await this._eventBus.publish(QueueEvents.SEND_OTP, message);
	}
}
