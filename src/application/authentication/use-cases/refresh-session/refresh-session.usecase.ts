import { inject, injectable } from "inversify";
import type {
	ISessionRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IHasherService, ITokenService } from "../../../services";
import type {
	RefreshSessionInput,
	RefreshSessionOutput,
} from "../../dtos/refresh-session.dto";
import { AuthenticationError, UnauthorizedError } from "../../errors";
import type { IRefreshSessionUseCase } from "./refresh-session.usecase.interface";

@injectable()
export class RefreshSessionUseCase implements IRefreshSessionUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
		@inject(TYPES.Repositories.SessionRepository)
		private _sessionRepository: ISessionRepository,
		@inject(TYPES.Services.Hasher)
		private _hasherService: IHasherService,
		@inject(TYPES.Services.TokenService)
		private _tokenService: ITokenService,
	) {}

	async execute(input: RefreshSessionInput): Promise<RefreshSessionOutput> {
		this._tokenService.verifyRefreshToken(input.refreshToken);

		const refreshTokenHash = await this._hasherService.hash(input.refreshToken);

		// Find the session by token hash
		const session =
			await this._sessionRepository.findByTokenHash(refreshTokenHash);

		if (!session) throw new UnauthorizedError();

		if (session.revoked) {
			throw new UnauthorizedError();
		}

		if (session.expiresAt < new Date()) {
			throw new UnauthorizedError();
		}

		const user = await this._userRepository.findById(session.userId);

		if (!user || user.isBlocked || !user.isVerified) {
			throw new AuthenticationError();
		}

		await this._sessionRepository.updateByOwnerId(session.userId, {
			lastUsedAt: new Date(),
		});

		// Issue a new access token
		const accessToken = this._tokenService.generateAccessToken({
			sub: user.id,
			role: user.role,
		});

		return {
			accessToken,
		};
	}
}
