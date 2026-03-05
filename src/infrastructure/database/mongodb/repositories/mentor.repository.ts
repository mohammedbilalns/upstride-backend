import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { Mentor } from "../../../../domain/entities/mentor.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type {
	IMentorRepository,
	MentorQuery,
} from "../../../../domain/repositories/mentor.repository.interface";
import { MentorMapper } from "../mappers/mentor.mapper";
import { type MentorDocument, MentorModel } from "../models/mentor.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoMentorRepository
	extends AbstractMongoRepository<Mentor, MentorDocument>
	implements IMentorRepository
{
	constructor() {
		super(MentorModel);
	}

	protected toDomain(doc: MentorDocument): Mentor {
		return MentorMapper.toDomain(doc);
	}

	protected toDocument(entity: Mentor): Partial<MentorDocument> {
		return MentorMapper.toDocument(entity);
	}

	async create(mentor: Mentor): Promise<Mentor> {
		return this.createDocument(mentor);
	}

	async findById(id: string): Promise<Mentor | null> {
		return this.findByIdDocument(id);
	}

	async findByUserId(userId: string): Promise<Mentor | null> {
		const doc = await this.model.findOne({ userId }).lean();
		return doc ? this.toDomain(doc as MentorDocument) : null;
	}

	async updateById(
		id: string,
		update: Partial<Mentor>,
	): Promise<Mentor | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();

		return doc ? this.toDomain(doc as MentorDocument) : null;
	}

	async updateStatus(
		id: string,
		isApproved: boolean,
		rejectionReason?: string | null,
	): Promise<Mentor | null> {
		const update: any = { isApproved };
		if (rejectionReason !== undefined) {
			update.rejectionReason = rejectionReason;
		}

		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();

		return doc ? this.toDomain(doc as MentorDocument) : null;
	}

	async paginate({ page, limit, query, sort }: PaginateParams<MentorQuery>) {
		const filter: QueryFilter<MentorDocument> = {};

		if (query?.isApproved !== undefined) {
			filter.isApproved = query.isApproved;
		}

		if (query?.userId) {
			filter.userId = query.userId;
		}

		const skip = (page - 1) * limit;

		const [docs, total] = await Promise.all([
			this.model
				.find(filter)
				.sort(sort ?? { createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			this.model.countDocuments(filter),
		]);

		const items = docs.map((doc) => this.toDomain(doc as MentorDocument));

		return this.buildPaginatedResult(items, total, page, limit);
	}
}
