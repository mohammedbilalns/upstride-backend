import { inject, injectable } from "inversify";
import type {
	ISessionRepository,
	IUserRepository,
} from "../../../../../domain/repositories";
import { TYPES } from "../../../../../shared/types/types";
import type { ITokenService } from "../../../../services";
import type { IIdGenerator } from "../../../../services/id-generator.service.interface";
import type { RefreshSessionInput, RefreshSessionOutput } from "../../dtos";
import { AuthenticationError, UnauthorizedError } from "../../errors";
import { assertUserCanAuthenticate } from "../helpers/assert-user-can-authenticate";
import type { IRefreshSessionUseCase } from ".";

@injectable()
export class RefreshSessionUseCase implements IRefreshSessionUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
		@inject(TYPES.Repositories.SessionRepository)
		private _sessionRepository: ISessionRepository,
		@inject(TYPES.Services.TokenService)
		private _tokenService: ITokenService,
		@inject(TYPES.Services.IdGenerator)
		private _idGenerator: IIdGenerator,
	) {}

	async execute(input: RefreshSessionInput): Promise<RefreshSessionOutput> {
		if (!input.refreshToken) {
			throw new UnauthorizedError();
		}

		const payload = await this._tokenService.verifyRefreshToken(
			input.refreshToken,
		);
		const { sid } = payload;

		const session = await this._sessionRepository.findBySid(sid);

		if (!session) throw new UnauthorizedError();

		if (session.revoked) {
			throw new UnauthorizedError();
		}

		const currentTokenHash = this._tokenService.hashToken(input.refreshToken);

		if (session.refreshTokenHash !== currentTokenHash) {
			await this._sessionRepository.updateBySid(sid, { revoked: true });
			throw new UnauthorizedError();
		}

		if (session.expiresAt < new Date()) {
			throw new UnauthorizedError();
		}

		const user = await this._userRepository.findById(session.userId);

		if (!user) {
			throw new AuthenticationError();
		}

		assertUserCanAuthenticate(user);

		const [accessTokenId, refreshTokenId] = this._idGenerator.generateMany(2);

		const [newRefreshToken, accessToken] = await Promise.all([
			await this._tokenService.generateRefreshToken({
				sub: user.id,
				jti: refreshTokenId,
				sid: session.sid,
			}),
			this._tokenService.generateAccessToken({
				sub: user.id,
				role: user.role,
				jti: accessTokenId,
				sid: session.sid,
			}),
		]);

		const newRefreshTokenHash = this._tokenService.hashToken(newRefreshToken);

		await this._sessionRepository.updateBySid(session.sid, {
			lastUsedAt: new Date(),
			refreshTokenHash: newRefreshTokenHash,
		});

		return {
			accessToken,
			refreshToken: newRefreshToken,
		};
	}
}
