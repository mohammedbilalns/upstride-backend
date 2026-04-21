import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { BlockAdminInput } from "../dtos/block-admin.dto";
import type { IBlockAdminUseCase } from "./block-admin.use-case.interface";

@injectable()
export class BlockAdminUseCase implements IBlockAdminUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(input: BlockAdminInput): Promise<void> {
		await this._userRepository.updateById(input.adminId, { isBlocked: true });
	}
}
