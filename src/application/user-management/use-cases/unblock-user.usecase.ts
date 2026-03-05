import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import { UserNotFoundError } from "../../authentication/errors";
import type { BlockUserInput } from "../dtos/block-user.dto";
import type { IUnblockUserUseCase } from "./unblock-user.usecase.interface";

@injectable()
export class UnblockUserUseCase implements IUnblockUserUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(input: BlockUserInput): Promise<void> {
		const user = await this._userRepository.findById(input.userId);
		if (!user) {
			throw new UserNotFoundError();
		}

		await this._userRepository.updateById(input.userId, { isBlocked: false });
	}
}
