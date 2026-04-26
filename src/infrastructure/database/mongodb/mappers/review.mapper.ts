import type { Types } from "mongoose";
import type { ReviewDto } from "../../../../application/modules/review/dtos/review.dto";
import { Review } from "../../../../domain/entities/review.entity";
import type { ReviewDocument } from "../models/review.model";
import { toIdString } from "../utils/id.util";

type PopulatedUserRef = {
	_id: Types.ObjectId;
	name?: string;
};

type ReviewDocumentWithUser = Omit<ReviewDocument, "userId"> & {
	userId: Types.ObjectId | PopulatedUserRef;
};

export class ReviewMapper {
	static toDomain(doc: ReviewDocument): Review {
		return new Review(
			doc._id.toString(),
			doc.mentorId.toString(),
			doc.userId.toString(),
			doc.bookingId.toString(),
			doc.rating,
			doc.comment,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: Review): Partial<ReviewDocument> {
		return {
			_id: entity.id,
			mentorId: entity.mentorId,
			userId: entity.userId as unknown as Types.ObjectId,
			bookingId: entity.bookingId,
			rating: entity.rating,
			comment: entity.comment,
		};
	}

	static toDto(entity: Review, reviewerName: string | null = null): ReviewDto {
		return {
			id: entity.id,
			mentorId: entity.mentorId,
			userId: entity.userId,
			bookingId: entity.bookingId,
			rating: entity.rating,
			comment: entity.comment,
			reviewerName,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toSummary(doc: ReviewDocumentWithUser) {
		const reviewerName = isPopulatedUserRef(doc.userId)
			? (doc.userId.name ?? null)
			: null;

		return {
			id: doc._id.toString(),
			mentorId: doc.mentorId.toString(),
			userId: toIdString(doc.userId),
			bookingId: doc.bookingId.toString(),
			rating: doc.rating,
			comment: doc.comment,
			reviewerName,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};
	}
}

const isPopulatedUserRef = (
	userId: Types.ObjectId | PopulatedUserRef,
): userId is PopulatedUserRef =>
	typeof userId === "object" && userId !== null && "_id" in userId;
