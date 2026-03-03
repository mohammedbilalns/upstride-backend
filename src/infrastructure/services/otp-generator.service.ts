import { randomInt } from "node:crypto";
import { injectable } from "inversify";
import type { IOtpGenerator } from "../../application/services";

@injectable()
export class CryptoOtpGenerator implements IOtpGenerator {
	generate(length: number): string {
		let otp = "";

		for (let i = 0; i < length; i++) {
			otp += randomInt(0, 10).toString();
		}

		return otp;
	}
}
