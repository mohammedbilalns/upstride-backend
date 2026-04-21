import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { UnblockAdminInput } from "../dtos/block-admin.dto";
import type { IUnblockAdminUseCase } from "./unblock-admin.use-case.interface";

@injectable()
export class UnblockAdminUseCase implements IUnblockAdminUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(input: UnblockAdminInput): Promise<void> {
		await this._userRepository.updateById(input.adminId, {
			isBlocked: false,
		});
	}
}
