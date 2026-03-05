import { inject, injectable } from "inversify";
import type { ISessionRepository } from "../../../../domain/repositories";
import type { ITokenRevocationRepository } from "../../../../domain/repositories/token-revokation.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { LogoutInput } from "../../dtos/logout.dto";
import type { ILogoutUseCase } from "./logout.usecase.interface";

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
	constructor(
		@inject(TYPES.Repositories.SessionRepository)
		private _sessionRepository: ISessionRepository,
		@inject(TYPES.Repositories.TokenRevocationRepository)
		private _tokenRevocationRepository: ITokenRevocationRepository,
	) {}
	async execute(input: LogoutInput): Promise<void> {
		const session = await this._sessionRepository.findBySid(input.sessionId);

		if (!session || session.revoked) return;

		const ttl = session.expiresAt.getTime() - Date.now();

		await Promise.all([
			this._sessionRepository.revoke(input.sessionId),
			this._tokenRevocationRepository.revokeSession(
				input.sessionId,
				Math.floor(ttl / 1000),
			),
		]);
	}
}
