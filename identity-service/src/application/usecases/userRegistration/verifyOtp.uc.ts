import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { IVerifyOtpUC } from "../../../domain/useCases/userRegistration/verifyOtp.uc.interface";
import { AppError } from "../../errors/AppError";
import { otpType } from "../../utils/otp.util";
import { generateSecureToken } from "../../utils/token.util";

export class VerifyOtpUC implements IVerifyOtpUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
	) {}

	async execute(email: string, otp: string): Promise<string> {
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

		const savedOtp = await this._verficationTokenRepository.getOtp(
			email,
			otpType.register,
		);
		if (!savedOtp)
			throw new AppError(ErrorMessage.OTP_NOT_FOUND, HttpStatus.NOT_FOUND);

		if (savedOtp !== otp) {
			await this._verficationTokenRepository.incrementCount(
				email,
				otpType.register,
			);
			throw new AppError(ErrorMessage.INVALID_OTP, HttpStatus.UNAUTHORIZED);
		}
		const user = await this._userRepository.findByEmailAndRole(email, "user")!;
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		await Promise.all([
			this._userRepository.update(user.id, { isVerified: false }),
			this._verficationTokenRepository.deleteOtp(email, otpType.register),
		]);

		const token = generateSecureToken();
		await this._verficationTokenRepository.saveToken(
			token,
			email,
			"register",
			15 * 60,
		);

		return token;
	}
}
