export interface IOtpRepository {
	saveCode(
		identifier: string,
		purpose: string,
		code: string,
		ttlSeconds: number,
	): Promise<void>;

	getCode(identifier: string, purpose: string): Promise<string | null>;

	incrementAttempts(
		identifier: string,
		purpose: string,
		ttlSeconds: number,
	): Promise<number>;

	incrementResends(
		identifier: string,
		purpose: string,
		ttlSeconds: number,
	): Promise<number>;

	getAttempts(identifier: string, purpose: string): Promise<number>;

	resetAttempts(identifier: string, purpose: string): Promise<void>;

	deleteAll(identifier: string, purpose: string): Promise<void>;
}
