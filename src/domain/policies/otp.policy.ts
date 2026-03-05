import type { OtpPurpose } from "./otp-purposes";

export interface IOtpPolicy {
	readonly purpose: OtpPurpose;
	readonly ttl: number;
	readonly maxAttempts: number;
	readonly maxResends: number;
}
