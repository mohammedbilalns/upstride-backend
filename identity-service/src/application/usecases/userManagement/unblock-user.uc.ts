import { IUserRepository } from "../../../domain/repositories";
import { IRevokedUserRepository } from "../../../domain/repositories/revokeduser.repository.interface";
import { IUnblockUserUC } from "../../../domain/useCases/userManagement/unblock-user.uc.interface";
import { UnblockUserDto } from "../../dtos/user.dto";

export class UnblockUserUC implements IUnblockUserUC {
	constructor(
		private _userRepository: IUserRepository,
		private _revokedUserRepository: IRevokedUserRepository,
	) {}

	async execute(dto: UnblockUserDto): Promise<void> {
		const { userId } = dto;
		this._userRepository.update(userId, { isBlocked: false });
		const isRevoked = await this._revokedUserRepository.isRevoked(userId);
		if (isRevoked) {
			this._revokedUserRepository.remove(userId);
		}
	}
}
