import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IEventBus } from "../../../domain/events/IEventBus";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { IInitiatePasswordResetUC } from "../../../domain/useCases/resetUserPassword/initiatePasswordReset.uc.interface";
import { AppError } from "../../errors/AppError";
import { generateOtp } from "../../utils/generateOtp";
import { buildOtpEmailHtml, OTP_SUBJECT, otpType } from "../../utils/otp.util";

export class InitiatePasswordResetUC implements IInitiatePasswordResetUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _eventBus: IEventBus,
	) {}

	async execute(email: string): Promise<void> {
		const user = await this._userRepository.findByEmail(email);

		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
		const otp = generateOtp();
		await this._verficationTokenRepository.saveOtp(
			otp,
			email,
			otpType.reset,
			300,
		);
		const message = {
			to: email,
			subject: OTP_SUBJECT,
			text: buildOtpEmailHtml(otp, otpType.reset),
		};
		await this._eventBus.publish("send.otp", message);
	}
}
