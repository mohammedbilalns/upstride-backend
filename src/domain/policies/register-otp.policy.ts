import type { IOtpPolicy } from "./otp.policy";
import { OtpPurpose } from "./otp-purposes";

export class RegisterOtpPolicy implements IOtpPolicy {
	readonly purpose = OtpPurpose.REGISTER;
	readonly ttl = 5 * 60;
	readonly maxAttempts = 5;
	readonly maxResends = 3;
}
