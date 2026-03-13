import { inject, injectable } from "inversify";
import type { ISessionRepository } from "../../../../domain/repositories";
import type { ITokenRevocationRepository } from "../../../../domain/repositories/token-revokation.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { ValidationError } from "../../../shared/errors/validation-error";
import type { RevokeSessionInput } from "../../dtos/session/logout.dto";
import { UnauthorizedError } from "../../errors";
import type { IRevokeSessionUseCase } from "./revoke-session.usecase.interface";

@injectable()
export class RevokeSessionUseCase implements IRevokeSessionUseCase {
	constructor(
		@inject(TYPES.Repositories.SessionRepository)
		private readonly _sessionRepository: ISessionRepository,
		@inject(TYPES.Repositories.TokenRevocationRepository)
		private readonly _tokenRevokationRepository: ITokenRevocationRepository,
	) {}

	async execute(input: RevokeSessionInput): Promise<void> {
		const session = await this._sessionRepository.findBySid(
			input.targetSessionId,
		);

		if (!session) throw new ValidationError();

		if (input.requesterUserId !== session.userId) throw new UnauthorizedError();

		const ttl = session.expiresAt.getTime() - Date.now();

		await Promise.all([
			this._sessionRepository.revoke(input.targetSessionId),
			this._tokenRevokationRepository.revokeSession(input.targetSessionId, ttl),
		]);
	}
}
