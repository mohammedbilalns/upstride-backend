import { RESEND_LIMIT } from "../../../common/constants/otpConfig";
import { REGISTER_TOKEN_EXPIRY } from "../../../common/constants/tokenOptions";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { IVerifyOtpUC } from "../../../domain/useCases/userRegistration/verifyOtp.uc.interface";
import { AppError } from "../../errors/AppError";
import { otpType } from "../../utils/mail.util";
import { generateSecureToken } from "../../utils/token.util";

/**
 * VerifyOtp Use Case
 * Validates OTP submitted during user registration and, if valid,
 * creates a short-lived secure token for the next step.
 */
export class VerifyOtpUC implements IVerifyOtpUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
	) {}

	async execute(email: string, otp: string): Promise<string> {
		// verify resend count doesn't exceed the limit
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

		// save otp and update count
		const storedOtp = await this._verficationTokenRepository.getOtp(
			email,
			otpType.register,
		);
		if (!storedOtp)
			throw new AppError(ErrorMessage.OTP_NOT_FOUND, HttpStatus.NOT_FOUND);

		if (storedOtp !== otp) {
			await this._verficationTokenRepository.incrementCount(
				email,
				otpType.register,
			);
			throw new AppError(ErrorMessage.INVALID_OTP, HttpStatus.UNAUTHORIZED);
		}
		// verify user exists
		const user = await this._userRepository.findByEmailAndRole(email, "user")!;
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		// update user and delete otp
		await Promise.all([
			this._userRepository.update(user.id, { isVerified: false }),
			this._verficationTokenRepository.deleteOtp(email, otpType.register),
		]);

		// generate and save temp token
		const token = generateSecureToken();
		await this._verficationTokenRepository.saveToken(
			token,
			email,
			"register",
			REGISTER_TOKEN_EXPIRY,
		);

		return token;
	}
}
