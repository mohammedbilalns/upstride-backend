import { inject, injectable } from "inversify";
import type { Session } from "../../../domain/entities/session.entity";
import type {
	ISessionRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import { UserNotFoundError } from "../../authentication/errors";
import type { BlockUserInput } from "../dtos/block-user.dto";
import type { IBlockUserUseCase } from "./block-user.usecase.interface";

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
		@inject(TYPES.Repositories.SessionRepository)
		private _sessionRepository: ISessionRepository,
	) {}

	async execute(input: BlockUserInput): Promise<void> {
		const user = await this._userRepository.findById(input.userId);
		if (!user) {
			throw new UserNotFoundError();
		}

		await this._userRepository.updateById(input.userId, { isBlocked: true });

		// Revoke all active sessions
		const sessions = await this._sessionRepository.findAllByUserId(
			input.userId,
		);
		const sids = sessions
			.filter((s: Session) => !s.revoked)
			.map((s: Session) => s.sid);

		if (sids.length > 0) {
			await this._sessionRepository.revokeMultiple(sids);
		}
	}
}
