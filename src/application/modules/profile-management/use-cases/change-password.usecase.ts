import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { ITokenService } from "../../../services";
import type { IPasswordService } from "../../../services/password.service.interface";
import { getUserByIdOrThrow } from "../../../shared/utilities/user.util";
import type { ChangePasswordInput } from "../../authentication/dtos";
import { AuthenticationError } from "../../authentication/errors";
import type { IChangePasswordUseCase } from "./change-password.usecase.interface";

@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Password)
		private readonly _passwordService: IPasswordService,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
	) {}

	async execute(input: ChangePasswordInput): Promise<void> {
		const user = await getUserByIdOrThrow(this._userRepository, input.userId);

		const payload = this._tokenService.verifyResetToken(input.token);

		if (payload.sub !== user.id) {
			throw new AuthenticationError();
		}

		const hashedPassword = await this._passwordService.hashPassword(
			input.newPassword,
		);

		await this._userRepository.updateById(user.id, {
			passwordHash: hashedPassword,
		});
	}
}
