import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IUserRepository } from "../../../domain/repositories";
import { ICryptoService } from "../../../domain/services";
import { IChangePasswordUC } from "../../../domain/useCases/profileMangement/change-password.uc.interface";
import { changePasswordDto } from "../../dtos/profile.dto";
import { AppError } from "../../errors/app-error";

export class ChangePasswordUC implements IChangePasswordUC {
	constructor(
		private _userRepository: IUserRepository,
		private _cryptoService: ICryptoService,
	) {}

	async execute(userId: string, data: changePasswordDto): Promise<void> {
		const { oldPassword, newPassword } = data;

		const user = await this._userRepository.findById(userId);

		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		if (!user.passwordHash)
			throw new AppError(
				ErrorMessage.REGISTERED_WITH_GOOGLE_ID,
				HttpStatus.FORBIDDEN,
			);
		const validOldPassword = await this._cryptoService.compare(
			oldPassword,
			user.passwordHash,
		);

		if (!validOldPassword)
			throw new AppError(
				ErrorMessage.INVALID_PASSWORD,
				HttpStatus.UNAUTHORIZED,
			);
		const hashedPassword = await this._cryptoService.hash(newPassword);
		await this._userRepository.update(userId, { passwordHash: hashedPassword });
	}
}
