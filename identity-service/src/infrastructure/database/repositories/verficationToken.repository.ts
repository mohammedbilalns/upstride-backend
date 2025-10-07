import type { Redis } from "ioredis";
import type { IVerificationTokenRepository } from "../../../domain/repositories/verificationtoken.repository.interface";

export class VerificationTokenRepository
	implements IVerificationTokenRepository
{
	constructor(private readonly redisClient: Redis) {}

	private getKey(email: string, type: string) {
		return `otp:${email}:${type}`;
	}
	async saveOtp(
		otp: string,
		email: string,
		type: string,
		expiryInSeconds: number = 300,
	): Promise<void> {
		const key = this.getKey(email, type);

		await this.redisClient
			.multi()
			.hset(key, "otp", otp, "resendCount", "0")
			.expire(key, expiryInSeconds)
			.exec();
	}

	async getOtp(email: string, type: string): Promise<string | null> {
		const key = this.getKey(email, type);
		return this.redisClient.hget(key, "otp");
	}

	async deleteOtp(email: string, type: string): Promise<void> {
		const key = this.getKey(email, type);
		await this.redisClient.del(key);
	}

	async existsOtp(email: string, type: string): Promise<boolean> {
		const key = this.getKey(email, type);
		return !!(await this.redisClient.exists(key));
	}

	async resetOtp(
		otp: string,
		email: string,
		type: string,
		expiryInSeconds: number = 300,
	): Promise<void> {
		const key = this.getKey(email, type);
		await this.redisClient.hincrby(key, "resendCount", 1);
		await this.redisClient.hset(key, "otp", otp);
		await this.redisClient.expire(key, expiryInSeconds);
	}

	async getResendCount(email: string, type: string): Promise<number> {
		const key = this.getKey(email, type);
		const count = await this.redisClient.hget(key, "resendCount");
		return count ? parseInt(count, 10) : 0;
	}

	async incrementCount(email: string, type: string): Promise<void> {
		const key = this.getKey(email, type);
		await this.redisClient.hincrby(key, "resendCount", 1);
	}

	async updateOtp(otp: string, email: string, type: string): Promise<void> {
		const key = this.getKey(email, type);
		await this.redisClient.hset(key, "otp", otp);
	}

	async saveToken(
		token: string,
		value: string,
		context: string,
		expiryInSeconds: number = 900,
	): Promise<void> {
		const key = `token:${token}:${context}`;
		await this.redisClient.setex(key, expiryInSeconds, value);
	}

	async getToken(token: string, context: string): Promise<string | null> {
		const key = `token:${token}:${context}`;
		return this.redisClient.get(key);
	}

	async deleteToken(token: string, context: string): Promise<void> {
		const key = `token:${token}:${context}`;
		await this.redisClient.del(key);
	}

	async tokenExists(token: string, context: string): Promise<boolean> {
		const key = `token:${token}:${context}`;
		const exists = await this.redisClient.exists(key);
		return exists === 1;
	}
}
