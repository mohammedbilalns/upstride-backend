import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IEventBus } from "../../../domain/events/IEventBus";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { IResendResetOtpUC } from "../../../domain/useCases/resetUserPassword/resendResetOtp.uc.interface";
import { AppError } from "../../errors/AppError";
import { generateOtp } from "../../utils/generateOtp";
import { buildOtpEmailHtml, OTP_SUBJECT, otpType } from "../../utils/otp.util";

export class ResendResetOtpUC implements IResendResetOtpUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _eventBus: IEventBus,
	) {}

	async execute(email: string): Promise<void> {
		const user = await this._userRepository.findByEmail(email);
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		const count =
			(await this._verficationTokenRepository.getResendCount(
				email,
				otpType.reset,
			)) ?? 0;
		if (count > 3) {
			await this._verficationTokenRepository.deleteOtp(email, otpType.reset);
			throw new AppError(
				ErrorMessage.TOO_MANY_OTP_ATTEMPTS,
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}
		const otp = generateOtp();
		await this._verficationTokenRepository.updateOtp(otp, email, otpType.reset);
		const message = {
			to: email,
			subject: OTP_SUBJECT,
			text: buildOtpEmailHtml(otp, otpType.reset),
		};
		await this._eventBus.publish("send.otp", message);
	}
}
