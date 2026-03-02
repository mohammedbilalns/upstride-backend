import argon2 from "argon2";
import { injectable } from "inversify";
import type { IPasswordHasherService } from "../../application/services";

@injectable()
export class Argon2PasswordHasherService implements IPasswordHasherService {
	async hash(password: string): Promise<string> {
		return argon2.hash(password);
	}

	async compare(password: string, hash: string): Promise<boolean> {
		return argon2.verify(password, hash);
	}
}
