import type { IOtpPolicy } from "./otp.policy";

export class RegisterOtpPolicy implements IOtpPolicy {
	readonly purpose = "REGISTER";
	readonly ttl = 5 * 60;
	readonly maxAttempts = 5;
	readonly maxResends = 3;
}
