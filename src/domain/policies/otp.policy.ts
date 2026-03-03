export interface IOtpPolicy {
	readonly purpose: string;
	readonly ttl: number;
	readonly maxAttempts: number;
	readonly maxResends: number;
}
