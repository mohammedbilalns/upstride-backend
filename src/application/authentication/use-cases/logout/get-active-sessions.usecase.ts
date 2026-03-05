import { inject, injectable } from "inversify";
import type { ISessionRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type {
	GetActiveSessionsInput,
	GetActiveSessionsResponse,
} from "../../dtos/get-active-sessions.dto";
import { ActiveSessionMapper } from "../../mappers/active-session.mapper";
import type { IGetActiveSessionsUseCase } from "./get-active-sessions.usecase.interface";

@injectable()
export class GetActiveSessionsUseCase implements IGetActiveSessionsUseCase {
	constructor(
		@inject(TYPES.Repositories.SessionRepository)
		private _sessionRepository: ISessionRepository,
	) {}

	async execute(
		input: GetActiveSessionsInput,
		currentSessionId: string,
	): Promise<GetActiveSessionsResponse> {
		const sessions = await this._sessionRepository.findAllByUserId(
			input.userId,
		);

		return {
			sessions: ActiveSessionMapper.toDTOs(sessions, currentSessionId),
		};
	}
}
