import { inject, injectable } from "inversify";
import type { Redis } from "ioredis";
import type { IOtpRepository } from "../../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../../shared/types/types";

@injectable()
export class RedisOtpRepository implements IOtpRepository {
	constructor(
		@inject(TYPES.Databases.Redis)
		private readonly redis: Redis,
	) {}

	private otpKey(id: string, purpose: string) {
		return `otp:${id}:${purpose}`;
	}

	private attemptsKey(id: string, purpose: string) {
		return `otp_attempts:${id}:${purpose}`;
	}

	private resendKey(id: string, purpose: string) {
		return `otp_resends:${id}:${purpose}`;
	}

	async saveCode(
		identifier: string,
		purpose: string,
		code: string,
		ttlSeconds: number,
	): Promise<void> {
		const otpKey = this.otpKey(identifier, purpose);
		const attemptsKey = this.attemptsKey(identifier, purpose);

		await Promise.all([
			this.redis.set(otpKey, code, "EX", ttlSeconds),
			this.redis.del(attemptsKey),
		]);
	}

	async getCode(identifier: string, purpose: string): Promise<string | null> {
		return this.redis.get(this.otpKey(identifier, purpose));
	}

	async incrementAttempts(
		identifier: string,
		purpose: string,
		ttlSeconds: number,
	): Promise<number> {
		const key = this.attemptsKey(identifier, purpose);
		const count = await this.redis.incr(key);

		if (count === 1) {
			await this.redis.expire(key, ttlSeconds);
		}

		return count;
	}

	async incrementResends(
		identifier: string,
		purpose: string,
		ttlSeconds: number,
	): Promise<number> {
		const key = this.resendKey(identifier, purpose);
		const count = await this.redis.incr(key);

		if (count === 1) {
			await this.redis.expire(key, ttlSeconds);
		}

		return count;
	}

	async resetAttempts(identifier: string, purpose: string): Promise<void> {
		await this.redis.del(this.attemptsKey(identifier, purpose));
	}

	async deleteAll(identifier: string, purpose: string): Promise<void> {
		await Promise.all([
			this.redis.del(this.otpKey(identifier, purpose)),
			this.redis.del(this.attemptsKey(identifier, purpose)),
			this.redis.del(this.resendKey(identifier, purpose)),
		]);
	}
}
