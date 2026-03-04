import argon2 from "argon2";
import { injectable } from "inversify";
import type { IHasherService } from "../../application/services";

@injectable()
export class Argon2HasherService implements IHasherService {
	async hash(password: string): Promise<string> {
		return argon2.hash(password);
	}

	async compare(password: string, hash: string): Promise<boolean> {
		return argon2.verify(password, hash);
	}

	async fakeCompare(): Promise<boolean> {
		await argon2.hash("fake_password");
		return false;
	}
}
