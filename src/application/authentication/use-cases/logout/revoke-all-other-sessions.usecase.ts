import { inject, injectable } from "inversify";
import type { ISessionRepository } from "../../../../domain/repositories";
import type { ITokenRevocationRepository } from "../../../../domain/repositories/token-revokation.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { RevokeAllOtherSessionsInput } from "../../dtos/logout.dto";
import type { IRevokeAllOtherSessionsUseCase } from "./revoke-all-other-sessions.usecase.interface";

@injectable()
export class RevokeAllOtherSessionsUseCase
	implements IRevokeAllOtherSessionsUseCase
{
	constructor(
		@inject(TYPES.Repositories.SessionRepository)
		private readonly _sessionRepository: ISessionRepository,
		@inject(TYPES.Repositories.TokenRevocationRepository)
		private readonly _tokenRevokationRepository: ITokenRevocationRepository,
	) {}

	async execute(input: RevokeAllOtherSessionsInput): Promise<void> {
		const sessions = await this._sessionRepository.findAllByUserId(
			input.requesterUserId,
		);

		const sessionsToRevoke = sessions.filter(
			(session) => session.sid !== input.requesterSessionId && !session.revoked,
		);

		if (sessionsToRevoke.length === 0) return;

		const sids = sessionsToRevoke.map((session) => session.sid);

		const sessionRevocationData = sessionsToRevoke.map((session) => ({
			sessionId: session.sid,
			ttl: Math.max(
				Math.floor((session.expiresAt.getTime() - Date.now()) / 1000),
				0,
			),
		}));

		await Promise.all([
			this._sessionRepository.revokeMultiple(sids),
			this._tokenRevokationRepository.revokeMultiple(sessionRevocationData),
		]);
	}
}
