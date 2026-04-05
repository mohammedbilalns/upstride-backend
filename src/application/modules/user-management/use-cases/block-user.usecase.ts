import { inject, injectable } from "inversify";
import type { Session } from "../../../../domain/entities/session.entity";
import { UserStatusChangedEvent } from "../../../../domain/events/user-status-changed.event";
import type {
	IReportRepository,
	ISessionRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import type { ITokenRevocationRepository } from "../../../../domain/repositories/token-revocation.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IEventBus } from "../../../events/app-event-bus.interface";
import { REFRESH_TOKEN_EXPIRES_IN } from "../../../services";
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
		@inject(TYPES.Repositories.TokenRevocationRepository)
		private _tokenRevocationRepository: ITokenRevocationRepository,
		@inject(TYPES.Repositories.ReportRepository)
		private _reportRepository: IReportRepository,
		@inject(TYPES.Services.AppEventBus)
		private _eventBus: IEventBus,
	) {}

	async execute(input: BlockUserInput): Promise<void> {
		const user = await this._userRepository.findById(input.userId);
		if (!user) {
			throw new UserNotFoundError();
		}

		await this._userRepository.updateById(input.userId, { isBlocked: true });

		const sessions = await this._sessionRepository.findAllByUserId(
			input.userId,
		);
		const sids = sessions
			.filter((s: Session) => !s.revoked)
			.map((s: Session) => s.sid as string);

		if (sids.length > 0) {
			await Promise.all([
				this._sessionRepository.revokeMultiple(sids),
				this._tokenRevocationRepository.revokeMultiple(
					sids.map((sid: string) => ({
						sessionId: sid,
						ttl: REFRESH_TOKEN_EXPIRES_IN,
					})),
				),
			]);
		}

		await this._eventBus.publish(
			new UserStatusChangedEvent({ userId: input.userId, isBlocked: true }),
			{ durable: true },
		);

		if (input.reportId) {
			await this._reportRepository.updateById(input.reportId, {
				status: "RESOLVED",
				actionTaken: "blocked user",
			});
		}
	}
}
