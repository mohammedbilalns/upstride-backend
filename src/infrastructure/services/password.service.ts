import argon2 from "argon2";
import { injectable } from "inversify";
import type { IPasswordService } from "../../application/services";

@injectable()
export class Argon2PasswordService implements IPasswordService {
	hashPassword(password: string): Promise<string> {
		return argon2.hash(password);
	}

	verifyPassword(password: string, passwordHash: string): Promise<boolean> {
		return argon2.verify(passwordHash, password);
	}

	async fakeVerify(): Promise<boolean> {
		await argon2.hash("fake_password");
		return false;
	}
}
