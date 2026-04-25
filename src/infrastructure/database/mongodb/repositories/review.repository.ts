import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { Review } from "../../../../domain/entities/review.entity";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities";
import type {
	IReviewRepository,
	ReviewStats,
	ReviewSummary,
} from "../../../../domain/repositories/review.repository.interface";
import { ReviewMapper } from "../mappers/review.mapper";
import { type ReviewDocument, ReviewModel } from "../models/review.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoReviewRepository
	extends AbstractMongoRepository<Review, ReviewDocument>
	implements IReviewRepository
{
	constructor() {
		super(ReviewModel);
	}

	protected toDomain(doc: ReviewDocument): Review {
		return ReviewMapper.toDomain(doc);
	}

	protected toDocument(entity: Review): Partial<ReviewDocument> {
		return ReviewMapper.toDocument(entity);
	}

	async create(entity: Review): Promise<Review> {
		return this.createDocument(entity);
	}

	async findById(id: string): Promise<Review | null> {
		return this.findByIdDocument(id);
	}

	async findByBookingId(bookingId: string): Promise<Review | null> {
		const doc = await this.model.findOne({ bookingId }).lean();
		return doc ? this.toDomain(doc as ReviewDocument) : null;
	}

	async findByBookingIds(bookingIds: string[]): Promise<Review[]> {
		if (bookingIds.length === 0) return [];
		const docs = await this.model
			.find({ bookingId: { $in: bookingIds } })
			.lean();
		return docs.map((doc) => this.toDomain(doc as ReviewDocument));
	}

	async paginateByMentorId(
		mentorId: string,
		page: number,
		limit: number,
	): Promise<PaginatedResult<ReviewSummary>> {
		const query: QueryFilter<ReviewDocument> = { mentorId };
		const skip = (page - 1) * limit;
		const [docs, total] = await Promise.all([
			this.model
				.find(query)
				.populate({ path: "userId", select: "name" })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			this.model.countDocuments(query),
		]);

		const items = docs.map((doc) =>
			ReviewMapper.toSummary(doc as ReviewDocument & { userId: unknown }),
		);

		return {
			items,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async getStatsByMentorId(mentorId: string): Promise<ReviewStats> {
		const result = await this.model.aggregate([
			{ $match: { mentorId } },
			{
				$group: {
					_id: "$mentorId",
					count: { $sum: 1 },
					averageRating: { $avg: "$rating" },
				},
			},
		]);

		const stats = result[0];
		return {
			count: stats?.count ?? 0,
			averageRating: Number(stats?.averageRating ?? 0),
		};
	}
}
