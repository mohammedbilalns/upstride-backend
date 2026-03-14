import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { ITokenService } from "../../../services";
import type { IPasswordService } from "../../../services/password.service.interface";
import type { UpdatePasswordInput } from "../../dtos";
import { AuthenticationError, UserNotFoundError } from "../../errors";
import type { IUpdatePasswordUseCase } from ".";

@injectable()
export class UpdatePasswordUseCase implements IUpdatePasswordUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Password)
		private readonly _passwordService: IPasswordService,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
	) {}

	async execute(input: UpdatePasswordInput): Promise<void> {
		const user = await this._userRepository.findByEmail(input.email);

		if (!user) throw new UserNotFoundError();

		const { sub } = this._tokenService.verifyResetToken(input.tempToken);

		if (sub !== user.id) throw new AuthenticationError();

		const hashedPassword = await this._passwordService.hashPassword(
			input.newPassword,
		);

		await this._userRepository.updateById(user.id, {
			passwordHash: hashedPassword,
		});
	}
}
