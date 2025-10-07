import argon2 from "argon2";
import type { ICryptoService } from "../../domain/services/crypto.service.interface";

export class CryptoService implements ICryptoService {
	async hash(data: string): Promise<string> {
		return argon2.hash(data);
	}

	async compare(data: string, hashedData: string): Promise<boolean> {
		return argon2.verify(hashedData, data);
	}
}
