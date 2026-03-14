import type { IOtpPolicy } from "./otp.policy";
import { OtpPurpose } from "./otp-purposes";

export class ChangePasswordOtpPolicy implements IOtpPolicy {
	readonly purpose = OtpPurpose.CHANGE_PASSWORD;
	readonly ttl = 5 * 60;
	readonly maxAttempts = 3;
	readonly maxResends = 3;
}
