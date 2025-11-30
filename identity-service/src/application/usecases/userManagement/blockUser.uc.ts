import { IUserRepository } from "../../../domain/repositories";
import { IRevokedUserRepository } from "../../../domain/repositories/revokeduser.repository.interface";
import { IBlockUserUC } from "../../../domain/useCases/userManagement/blockUser.uc.interface";

export class BlockUserUC implements IBlockUserUC {
	constructor(
		private _userRepository: IUserRepository,
		private _revokedUserRepository: IRevokedUserRepository,
	) {}

	async execute(userId: string): Promise<void> {
		this._userRepository.update(userId, { isBlocked: true });
		this._revokedUserRepository.add(userId);
	}
}
