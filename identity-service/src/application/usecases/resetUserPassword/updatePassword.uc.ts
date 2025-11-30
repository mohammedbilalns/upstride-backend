import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { ICryptoService } from "../../../domain/services";
import { IUpdatePasswordUC } from "../../../domain/useCases/resetUserPassword/updatePassword.uc.interface";
import { AppError } from "../../errors/AppError";

export class UpdatePasswordUC implements IUpdatePasswordUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _cryptoService: ICryptoService,
	) {}

	async execute(
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
