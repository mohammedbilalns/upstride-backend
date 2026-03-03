import type { IOtpPolicy } from "./otp.policy";

export class ResetPasswordOtpPolicy implements IOtpPolicy {
	readonly purpose = "RESET_PASSWORD";
	readonly ttl = 3 * 60;
	readonly maxAttempts = 3;
	readonly maxResends = 3;
}
