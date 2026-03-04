import { randomUUID } from "node:crypto";
import { inject, injectable } from "inversify";
import type {
	ISessionRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { ITokenService } from "../../../services";
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
		@inject(TYPES.Services.TokenService)
		private _tokenService: ITokenService,
	) {}

	async execute(input: RefreshSessionInput): Promise<RefreshSessionOutput> {
		const payload = this._tokenService.verifyRefreshToken(input.refreshToken);
		const { sid } = payload;

		const session = await this._sessionRepository.findById(sid);

		if (!session) throw new UnauthorizedError();

		if (session.revoked) {
			throw new UnauthorizedError();
		}

		const currentTokenHash = this._tokenService.hashToken(input.refreshToken);

		if (session.refreshTokenHash !== currentTokenHash) {
			await this._sessionRepository.updateById(sid, { revoked: true });
			throw new UnauthorizedError();
		}

		if (session.expiresAt < new Date()) {
			throw new UnauthorizedError();
		}

		const user = await this._userRepository.findById(session.userId);

		if (!user || user.isBlocked || !user.isVerified) {
			throw new AuthenticationError();
		}

		const accessTokenId = randomUUID();
		const refreshTokenId = randomUUID();

		const newRefreshToken = this._tokenService.generateRefreshToken({
			sub: user.id,
			jti: refreshTokenId,
			sid: session.id,
		});

		const newRefreshTokenHash = this._tokenService.hashToken(newRefreshToken);

		await this._sessionRepository.updateById(session.id, {
			lastUsedAt: new Date(),
			refreshTokenHash: newRefreshTokenHash,
		});

		const accessToken = this._tokenService.generateAccessToken({
			sub: user.id,
			role: user.role,
			jti: accessTokenId,
			sid: session.id,
		});

		return {
			accessToken,
			refreshToken: newRefreshToken,
		};
	}
}
