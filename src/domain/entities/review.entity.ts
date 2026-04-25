import { EntityValidationError } from "../errors";

export class Review {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly bookingId: string,
		public readonly rating: number,
		public readonly comment: string,
	) {}

	static create(userId: string, bookingId: string, rating: number) {
		if (rating < 1 || rating > 5) {
			throw new EntityValidationError(
				"Review",
				"Rating must be between 1 and 5",
			);
		}

		return {
			userId,
			bookingId,
			rating,
		};
	}
}
