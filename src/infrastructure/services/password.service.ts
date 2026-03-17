import argon2 from "argon2";
import { injectable } from "inversify";
import type { IPasswordService } from "../../application/services";
import { SOCIAL_AUTH_PASSWORD_PLACEHOLDER } from "../../domain/config/password.config";

@injectable()
// Implements password hashing with Argon2.
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

	hashPlaceholderPassword(): Promise<string> {
		return argon2.hash(SOCIAL_AUTH_PASSWORD_PLACEHOLDER);
	}
}
