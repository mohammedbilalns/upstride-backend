import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import type { ChangePasswordInput } from "../../authentication/dtos/change-password.dto";
import {
	AuthenticationError,
	UserNotFoundError,
} from "../../authentication/errors";
import type { IHasherService, ITokenService } from "../../services";
import type { IChangePasswordUseCase } from "./change-password.usecase.interface";

@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Hasher)
		private readonly _hasherService: IHasherService,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
	) {}

	async execute(input: ChangePasswordInput): Promise<void> {
		const user = await this._userRepository.findById(input.userId);

		if (!user) {
			throw new UserNotFoundError();
		}

		const payload = this._tokenService.verifyResetToken(input.token);

		if (payload.sub !== user.id) {
			throw new AuthenticationError();
		}

		const hashedPassword = await this._hasherService.hash(input.newPassword);

		await this._userRepository.updateById(user.id, {
			passwordHash: hashedPassword,
		});
	}
}
