import { inject, injectable } from "inversify";
import type { Redis } from "ioredis";
import type { IOtpRepository } from "../../../../domain/repositories/otp.repository.interface";
import { TYPES } from "../../../../shared/types/types";

@injectable()
export class RedisOtpRepository implements IOtpRepository {
	constructor(
		@inject(TYPES.Databases.Redis)
		private readonly _redis: Redis,
	) {}

	private _otpKey(id: string, purpose: string) {
		return `otp:${id}:${purpose}`;
	}

	private _attemptsKey(id: string, purpose: string) {
		return `otp_attempts:${id}:${purpose}`;
	}

	private _resendKey(id: string, purpose: string) {
		return `otp_resends:${id}:${purpose}`;
	}

	async saveCode(
		identifier: string,
		purpose: string,
		code: string,
		ttlSeconds: number,
	): Promise<void> {
		const otpKey = this._otpKey(identifier, purpose);
		const attemptsKey = this._attemptsKey(identifier, purpose);

		await Promise.all([
			this._redis.set(otpKey, code, "EX", ttlSeconds),
			this._redis.del(attemptsKey),
		]);
	}

	async getCode(identifier: string, purpose: string): Promise<string | null> {
		return this._redis.get(this._otpKey(identifier, purpose));
	}

	async incrementAttempts(
		identifier: string,
		purpose: string,
		ttlSeconds: number,
	): Promise<number> {
		const key = this._attemptsKey(identifier, purpose);
		const count = await this._redis.incr(key);

		if (count === 1) {
			await this._redis.expire(key, ttlSeconds);
		}

		return count;
	}

	async incrementResends(
		identifier: string,
		purpose: string,
		ttlSeconds: number,
	): Promise<number> {
		const key = this._resendKey(identifier, purpose);
		const count = await this._redis.incr(key);

		if (count === 1) {
			await this._redis.expire(key, ttlSeconds);
		}

		return count;
	}

	async getAttempts(identifier: string, purpose: string): Promise<number> {
		const count = await this._redis.get(this._attemptsKey(identifier, purpose));
		return count ? Number.parseInt(count, 10) : 0;
	}

	async resetAttempts(identifier: string, purpose: string): Promise<void> {
		await this._redis.del(this._attemptsKey(identifier, purpose));
	}

	async deleteAll(identifier: string, purpose: string): Promise<void> {
		await Promise.all([
			this._redis.del(this._otpKey(identifier, purpose)),
			this._redis.del(this._attemptsKey(identifier, purpose)),
			this._redis.del(this._resendKey(identifier, purpose)),
		]);
	}
}
