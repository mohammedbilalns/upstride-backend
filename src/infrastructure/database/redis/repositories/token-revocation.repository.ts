import { inject, injectable } from "inversify";
import type Redis from "ioredis";
import type { ITokenRevocationRepository } from "../../../../domain/repositories/token-revocation.repository.interface";
import { TYPES } from "../../../../shared/types/types";

@injectable()
export class RedisTokenRevocationRepository
	implements ITokenRevocationRepository
{
	constructor(@inject(TYPES.Databases.Redis) private _redis: Redis) {}

	async revokeSession(sessionId: string, ttl: number) {
		await this._redis.set(`revoked_session:${sessionId}`, "1", "EX", ttl);
	}

	async revokeMultiple(sessions: { sessionId: string; ttl: number }[]) {
		if (sessions.length === 0) return;
		const pipeline = this._redis.pipeline();
		for (const session of sessions) {
			pipeline.set(
				`revoked_session:${session.sessionId}`,
				"1",
				"EX",
				session.ttl,
			);
		}
		await pipeline.exec();
	}

	async isSessionRevoked(sessionId: string) {
		return Boolean(await this._redis.exists(`revoked_session:${sessionId}`));
	}
}
