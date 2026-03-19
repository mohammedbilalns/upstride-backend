import { injectable } from "inversify";
import type { SortOrder } from "mongoose";
import type { SessionBooking } from "../../../../domain/entities/session-booking.entity";
import type { ISessionBookingRepository } from "../../../../domain/repositories/session-booking.repository.interface";
import { SessionBookingMapper } from "../mappers/session-booking.mapper";
import {
	type SessionBookingDocument,
	SessionBookingModel,
} from "../models/session-booking.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoSessionBookingRepository
	extends AbstractMongoRepository<SessionBooking, SessionBookingDocument>
	implements ISessionBookingRepository
{
	constructor() {
		super(SessionBookingModel);
	}

	protected toDomain(doc: SessionBookingDocument): SessionBooking {
		return SessionBookingMapper.toDomain(doc);
	}

	protected toDocument(
		entity: SessionBooking,
	): Partial<SessionBookingDocument> {
		return SessionBookingMapper.toDocument(entity);
	}

	async create(entity: SessionBooking): Promise<SessionBooking> {
		return this.createDocument(entity);
	}

	async findById(id: string): Promise<SessionBooking | null> {
		return this.findByIdDocument(id);
	}

	async findByUserId(userId: string): Promise<SessionBooking[]> {
		const docs = await this.model.find({ userId }).lean();
		return docs.map((doc) => this.toDomain(doc as SessionBookingDocument));
	}

	async findByMentorId(mentorId: string): Promise<SessionBooking[]> {
		const docs = await this.model.find({ mentorId }).lean();
		return docs.map((doc) => this.toDomain(doc as SessionBookingDocument));
	}

	async updateById(
		id: string,
		data: Partial<SessionBooking>,
	): Promise<SessionBooking | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, data, { returnDocument: "after" })
			.lean();
		return doc ? this.toDomain(doc as SessionBookingDocument) : null;
	}

	async paginateByUser(
		userId: string,
		filter: "all" | "past" | "cancelled" | "upcoming",
		page: number,
		limit: number,
	) {
		const { query, sort } = this.buildFilterQuery(filter);
		const skip = (page - 1) * limit;
		const fullQuery = { userId, ...query };

		const [docs, total] = await Promise.all([
			this.model.find(fullQuery).sort(sort).skip(skip).limit(limit).lean(),
			this.model.countDocuments(fullQuery),
		]);

		return this.buildPaginatedResult(
			docs.map((doc) => this.toDomain(doc as SessionBookingDocument)),
			total,
			page,
			limit,
		);
	}

	async paginateByMentor(
		mentorId: string,
		filter: "all" | "past" | "cancelled" | "upcoming",
		page: number,
		limit: number,
		excludeUserId?: string,
	) {
		const { query, sort } = this.buildFilterQuery(filter);
		const skip = (page - 1) * limit;
		const fullQuery: Record<string, unknown> = { mentorId, ...query };
		if (excludeUserId) {
			fullQuery.userId = { $ne: excludeUserId };
		}

		const [docs, total] = await Promise.all([
			this.model.find(fullQuery).sort(sort).skip(skip).limit(limit).lean(),
			this.model.countDocuments(fullQuery),
		]);

		return this.buildPaginatedResult(
			docs.map((doc) => this.toDomain(doc as SessionBookingDocument)),
			total,
			page,
			limit,
		);
	}

	private buildFilterQuery(filter: "all" | "past" | "cancelled" | "upcoming"): {
		query: Record<string, unknown>;
		sort: Record<string, SortOrder>;
	} {
		const now = new Date();
		switch (filter) {
			case "cancelled":
				return {
					query: { status: "cancelled" as const },
					sort: { updatedAt: -1 },
				};
			case "past":
				return {
					query: {
						endTime: { $lt: now },
						status: { $in: ["confirmed", "completed"] },
					},
					sort: { startTime: -1 },
				};
			case "upcoming":
				return {
					query: {
						endTime: { $gte: now },
						status: { $in: ["confirmed", "pending"] },
					},
					sort: { startTime: 1 },
				};
			default:
				return { query: {}, sort: { startTime: -1 } };
		}
	}
}
