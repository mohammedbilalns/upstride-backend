import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { ICryptoService } from "../../../domain/services";
import { IUpdatePasswordUC } from "../../../domain/useCases/resetUserPassword/updatePassword.uc.interface";
import { updatePasswordParam } from "../../dtos/updatePassword.dto";
import { AppError } from "../../errors/AppError";

export class UpdatePasswordUC implements IUpdatePasswordUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _cryptoService: ICryptoService,
	) {}

	/**
	 * Handles the password reset process after a valid reset token is provided.
	 * Steps:
	 *  1. Validate reset token and user identity
	 *  2. Hash the new password
	 *  3. Update user password & invalidate token
	 */
	async execute(dto: updatePasswordParam): Promise<void> {
		// run token and user lookup
		const [userEmail, user] = await Promise.all([
			this._verficationTokenRepository.getToken(
				dto.resetToken,
				"forgot_password",
			),
			this._userRepository.findByEmail(dto.email),
		]);

		// validate token and user
		if (!userEmail) {
			throw new AppError(ErrorMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
		}
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		// hash new password
		const hashedPassword = await this._cryptoService.hash(dto.newPassword);

		// update user password and invalidate token
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
