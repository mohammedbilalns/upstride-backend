import { EntityValidationError } from "../errors";

export class Review {
	constructor(
		public readonly id: string,
		public readonly mentorId: string,
		public readonly userId: string,
		public readonly bookingId: string,
		public readonly rating: number,
		public readonly comment: string,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}

	static create(
		mentorId: string,
		userId: string,
		bookingId: string,
		rating: number,
		comment: string,
	) {
		if (rating < 1 || rating > 5) {
			throw new EntityValidationError(
				"Review",
				"Rating must be between 1 and 5",
			);
		}
		if (!comment.trim()) {
			throw new EntityValidationError("Review", "Comment is required");
		}

		return {
			mentorId,
			userId,
			bookingId,
			rating,
			comment,
		};
	}
}
