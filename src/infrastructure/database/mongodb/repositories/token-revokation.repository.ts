import { inject, injectable } from "inversify";
import type Redis from "ioredis";
import type { ITokenRevocationRepository } from "../../../../domain/repositories/token-revokation.repository.interface";
import { TYPES } from "../../../../shared/types/types";

@injectable()
export class RedisTokenRevocationRepository
	implements ITokenRevocationRepository
{
	constructor(@inject(TYPES.Databases.Redis) private redis: Redis) {}

	async revokeSession(sessionId: string, ttl: number) {
		await this.redis.set(`revoked_session:${sessionId}`, "1", "EX", ttl);
	}

	async isSessionRevoked(sessionId: string) {
		return Boolean(await this.redis.exists(`revoked_session:${sessionId}`));
	}
}
