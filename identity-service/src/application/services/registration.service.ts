import { IRegistrationService } from "../../domain/services/registration.service.interface";
import { IUserRepository,IVerificationTokenRepository } from "../../domain/repositories";
import { ICryptoService,ITokenService, IOtpService } from "../../domain/services";
import { IEventBus } from "../../domain/events/IEventBus";
import { UserDTO } from "../../application/dtos";
import { AppError } from "../../application/errors/AppError";
import { HttpStatus, ErrorMessage } from "../../common/enums";
import { OTP_SUBJECT, otpType, buildOtpEmailHtml } from "../../application/utils/otp.util";
import { generateSecureToken } from "../utils/token.util";

export class RegistrationService implements IRegistrationService {
	constructor(private _userRepository: IUserRepository,
		private _cryptoService: ICryptoService,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _tokenService: ITokenService,
		private _otpService: IOtpService,
		private _eventBus: IEventBus) {}

	private async generateTokens(
		user: UserDTO,
	): Promise<{ newAccessToken: string; newRefreshToken: string }> {
		const [newAccessToken, newRefreshToken] = await Promise.all([
			this._tokenService.generateAccessToken(user),
			this._tokenService.generateRefreshToken(user),
		]);
		return { newAccessToken, newRefreshToken };
	}

	async registerUser(
		name: string,
		email: string,
		phone: string,
		password: string,
	): Promise<void> {
		const existingUser = await this._userRepository.findByEmail(email);
		if (existingUser && existingUser?.isVerified)
			throw new AppError(
				ErrorMessage.EMAIL_ALREADY_EXISTS,
				HttpStatus.BAD_REQUEST,
			);
		if (existingUser && !existingUser?.isVerified)
			await this._userRepository.delete(existingUser.id);
		const hashedPassword = await this._cryptoService.hash(password);
		await this._userRepository.create({
			email,
			phone,
			name,
			passwordHash: hashedPassword,
		});
		const otp = await this._otpService.generateOtp();
		await this._verficationTokenRepository.saveOtp(otp, email, otpType.register, 300);
		const message = {
			to: email,
			subject: OTP_SUBJECT,
			text: buildOtpEmailHtml(otp, otpType.register),
		};
		await this._eventBus.publish("send.otp", message);
	}

	async verifyOtp(
		email: string,
		otp: string,
	): Promise<string> {
		const count =
			(await this._verficationTokenRepository.getResendCount(email, otpType.register)) ?? 0;

		if (count > 3) {
			await this._verficationTokenRepository.deleteOtp(email, otpType.register);
			throw new AppError(
				ErrorMessage.TOO_MANY_OTP_ATTEMPTS,
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}

		const savedOtp = await this._verficationTokenRepository.getOtp(email, otpType.register);
		if (!savedOtp)
			throw new AppError(ErrorMessage.OTP_NOT_FOUND, HttpStatus.NOT_FOUND);

		if (savedOtp !== otp) {
			await this._verficationTokenRepository.incrementCount(email, otpType.register);
			throw new AppError(ErrorMessage.INVALID_OTP, HttpStatus.UNAUTHORIZED);
		}
		const user = await this._userRepository.findByEmailAndRole(email, "user")!;
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		await Promise.all([
			this._userRepository.update(user.id, { isVerified: false }),
			this._verficationTokenRepository.deleteOtp(email, otpType.register),
		]);

		
		const token = generateSecureToken()
		await this._verficationTokenRepository.saveToken(token,email,"register",15*60)

		return token; 
	}

	async resendRegisterOtp(email: string): Promise<void> {
		const user = await this._userRepository.findByEmailAndRole(email, "user");
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
		const count =
			(await this._verficationTokenRepository.getResendCount(email, otpType.register)) ?? 0;
		if (count > 3) {
			await this._verficationTokenRepository.deleteOtp(email, otpType.register);
			throw new AppError(
				ErrorMessage.TOO_MANY_OTP_ATTEMPTS,
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}

		const otp = await this._otpService.generateOtp();
		await this._verficationTokenRepository.updateOtp(otp, email, otpType.register);
		const message = {
			to: email,
			subject: OTP_SUBJECT,
			text: buildOtpEmailHtml(otp, otpType.register),
		};
		await this._eventBus.publish("send.otp", message);
	}

	async createInterests(email:string, expertises:string[], skills:string[],token:string):Promise<{accessToken:string, refreshToken: string, user:UserDTO}>{

		const [validToken, user] = await Promise.all([
			this._verficationTokenRepository.getToken(token,"register"),
			this._userRepository.findByEmail(email),
		])
		if(!validToken){
			throw new AppError(ErrorMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
		}
		if(!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
	    
		const { newAccessToken, newRefreshToken } = await this.generateTokens(user);

		await this._userRepository.update(user.id, {
			interestedExpertises: expertises,
			interestedSkills: skills,
			isVerified: true,
		});
		const { passwordHash, isBlocked, isVerified, googleId, ...publicUser } = user;
		return { accessToken : newAccessToken, refreshToken: newRefreshToken,user: publicUser};

	}

}
