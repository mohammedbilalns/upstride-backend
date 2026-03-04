import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IHasherService, ITokenService } from "../../../services";
import type { ChangePasswordInput } from "../../dtos/reset-password.dto";
import { AuthenticationError, UserNotFoundError } from "../../errors";
import type { IChangePasswordUseCase } from "./change-password.usecase.interface";

@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Hasher)
		private readonly _passwordHasherService: IHasherService,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
	) {}

	async execute(input: ChangePasswordInput): Promise<void> {
		const user = await this._userRepository.findByEmail(input.email);

		if (!user) throw new UserNotFoundError();

		const { sub } = this._tokenService.verifyResetToken(input.tempToken);

		if (sub !== user.id) throw new AuthenticationError();

		const hashedPassword = await this._passwordHasherService.hash(
			input.newPassword,
		);

		await this._userRepository.updateById(user.id, {
			passwordHash: hashedPassword,
		});
	}
}
