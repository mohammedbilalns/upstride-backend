import type { IOtpPolicy } from "./otp.policy";
import { OtpPurpose } from "./otp-purposes";

export class ResetPasswordOtpPolicy implements IOtpPolicy {
	readonly purpose = OtpPurpose.RESET_PASSWORD;
	readonly ttl = 3 * 60;
	readonly maxAttempts = 3;
	readonly maxResends = 3;
}
