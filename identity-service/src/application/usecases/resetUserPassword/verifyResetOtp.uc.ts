import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IVerificationTokenRepository } from "../../../domain/repositories";
import { IVerifyResetOtpUC } from "../../../domain/useCases/resetUserPassword/verifyResetOtp.uc.interface";
import { AppError } from "../../errors/AppError";
import { otpType } from "../../utils/otp.util";
import { generateSecureToken } from "../../utils/token.util";

export class VerifyResetOtpUC implements IVerifyResetOtpUC {
	constructor(
		private _verficationTokenRepository: IVerificationTokenRepository,
	) {}

	async execute(email: string, otp: string): Promise<string> {
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
		const savedOtp = await this._verficationTokenRepository.getOtp(
			email,
			otpType.reset,
		);
		if (!savedOtp)
			throw new AppError(ErrorMessage.OTP_NOT_FOUND, HttpStatus.NOT_FOUND);
		if (savedOtp !== otp) {
			await this._verficationTokenRepository.incrementCount(
				email,
				otpType.reset,
			);
			throw new AppError(ErrorMessage.INVALID_OTP, HttpStatus.UNAUTHORIZED);
		}
		await this._verficationTokenRepository.deleteOtp(email, otpType.reset);
		const token = generateSecureToken();
		await this._verficationTokenRepository.saveToken(
			token,
			email,
			"forgot_password",
			15 * 60,
		);
		return token;
	}
}
