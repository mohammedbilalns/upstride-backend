import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IVerificationTokenRepository } from "../../../domain/repositories";
import { IVerifyResetOtpUC } from "../../../domain/useCases/resetUserPassword/verify-reset-otp.uc.interface";
import { verifyResetOtpParam } from "../../dtos/update-password.dto";
import { AppError } from "../../errors/app-error";
import { otpType } from "../../utils/mail.util";
import { generateSecureToken } from "../../utils/token.util";

export class VerifyResetOtpUC implements IVerifyResetOtpUC {
	constructor(
		private _verficationTokenRepository: IVerificationTokenRepository,
	) {}

	/**
	 * Verifies user-provided OTP during password reset.
	 * If OTP is valid, returns a secure "reset token"
	 * that allows the user to set a new password.
	 */
	async execute(dto: verifyResetOtpParam): Promise<string> {
		// Check number of OTP attempts
		const count =
			(await this._verficationTokenRepository.getResendCount(
				dto.email,
				otpType.reset,
			)) ?? 0;

		// Block user after too many incorrect attempts and remove OTP
		if (count > 3) {
			await this._verficationTokenRepository.deleteOtp(
				dto.email,
				otpType.reset,
			);
			throw new AppError(
				ErrorMessage.TOO_MANY_OTP_ATTEMPTS,
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}

		// retrieve saved OTP
		const savedOtp = await this._verficationTokenRepository.getOtp(
			dto.email,
			otpType.reset,
		);

		// validate OTP
		if (!savedOtp)
			throw new AppError(ErrorMessage.OTP_NOT_FOUND, HttpStatus.NOT_FOUND);
		if (savedOtp !== dto.otp) {
			await this._verficationTokenRepository.incrementCount(
				dto.email,
				otpType.reset,
			);
			throw new AppError(ErrorMessage.INVALID_OTP, HttpStatus.UNAUTHORIZED);
		}

		// delete OTP and generate secure token
		await this._verficationTokenRepository.deleteOtp(dto.email, otpType.reset);
		const token = generateSecureToken();
		await this._verficationTokenRepository.saveToken(
			token,
			dto.email,
			"forgot_password",
			15 * 60,
		);
		return token;
	}
}
