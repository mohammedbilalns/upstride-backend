import { randomUUID } from "node:crypto";
import { injectable } from "inversify";
import type { IIdGenerator } from "../../application/services/id-generator.service.interface";

@injectable()
export class UuidGenerator implements IIdGenerator {
	generate(): string {
		return randomUUID();
	}

	generateMany(count: number): string[] {
		const ids: string[] = new Array(count);

		for (let i = 0; i < count; i++) {
			ids[i] = randomUUID();
		}

		return ids;
	}
}
