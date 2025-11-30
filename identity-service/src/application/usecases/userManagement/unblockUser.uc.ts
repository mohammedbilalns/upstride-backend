import { IUserRepository } from "../../../domain/repositories";
import { IRevokedUserRepository } from "../../../domain/repositories/revokeduser.repository.interface";
import { IUnblockUserUC } from "../../../domain/useCases/userManagement/unblockUser.uc.interface";

export class UnblockUserUC implements IUnblockUserUC {
	constructor(
		private _userRepository: IUserRepository,
		private _revokedUserRepository: IRevokedUserRepository,
	) {}

	async execute(userId: string): Promise<void> {
		this._userRepository.update(userId, { isBlocked: false });
		const isRevoked = await this._revokedUserRepository.isRevoked(userId);
		if (isRevoked) {
			this._revokedUserRepository.remove(userId);
		}
	}
}
