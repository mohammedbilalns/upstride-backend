import argon2 from "argon2";
import { injectable } from "inversify";
import type { ICryptoService } from "../../domain/service/crypto.service";

@injectable()
export class Argon2Service implements ICryptoService {
	async hash(password: string): Promise<string> {
		return argon2.hash(password);
	}

	async compare(password: string, hash: string): Promise<boolean> {
		return argon2.verify(password, hash);
	}
}
