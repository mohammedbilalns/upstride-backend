import { AppError } from "../../application/errors/AppError";
import {
	buildOtpEmailHtml,
	OTP_SUBJECT,
	otpType,
} from "../../application/utils/otp.util";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { IEventBus } from "../../domain/events/IEventBus";
import type {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../domain/repositories";
import type { ICryptoService } from "../../domain/services";
import type { IPasswordResetService } from "../../domain/services/passwordReset.service.interface";
import { generateOtp } from "../utils/generateOtp";
import { generateSecureToken } from "../utils/token.util";

export class PasswordResetService implements IPasswordResetService {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _cryptoService: ICryptoService,
		private _eventBus: IEventBus,
	) {}

	async initiatePasswordReset(email: string): Promise<void> {
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

	async verifyResetOtp(email: string, otp: string): Promise<string> {
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

	async resendResetOtp(email: string): Promise<void> {
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

	async updatePassword(
		email: string,
		newPassword: string,
		resetToken: string,
	): Promise<void> {
		const [userEmail, user] = await Promise.all([
			this._verficationTokenRepository.getToken(resetToken, "forgot_password"),
			this._userRepository.findByEmail(email),
		]);
		if (!userEmail) {
			throw new AppError(ErrorMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
		}
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		const hashedPassword = await this._cryptoService.hash(newPassword);
		await Promise.all([
			this._userRepository.update(user.id, {
				passwordHash: hashedPassword,
			}),
			this._verficationTokenRepository.deleteToken(
				userEmail,
				"forgot_password",
			),
		]);
	}
}
