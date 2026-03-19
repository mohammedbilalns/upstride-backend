import { EntityValidationError } from "../errors";

export class PlatformWallet {
	constructor(
		public readonly id: string,
		public readonly balance: number,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {
		if (balance < 0) {
			throw new EntityValidationError(
				"PlatformWallet",
				"Balance cannot be negative",
			);
		}
	}
}
