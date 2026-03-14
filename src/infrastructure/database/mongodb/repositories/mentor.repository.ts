import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { Mentor } from "../../../../domain/entities/mentor.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities/paginatable.repository.interface";
import type {
	IMentorRepository,
	MentorApplicationDetails,
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
		const update: Record<string, unknown> = { isApproved };
		if (rejectionReason !== undefined) {
			update.rejectionReason = rejectionReason;
		}

		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();

		return doc ? this.toDomain(doc as MentorDocument) : null;
	}

	async paginate({
		page,
		limit,
		query,
		sort,
	}: PaginateParams<MentorQuery>): Promise<
		PaginatedResult<MentorApplicationDetails>
	> {
		const filter: QueryFilter<MentorDocument> = {};

		if (query?.isApproved !== undefined) {
			filter.isApproved = query.isApproved;
		}

		if (query?.isRejected !== undefined) {
			filter.isRejected = query.isRejected;
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
				.populate("userId", "name email avatar")
				.populate("currentRoleId", "name")
				.populate("areasOfExpertise", "name")
				.populate("toolsAndSkills.skillId", "name interestId")
				.lean(),
			this.model.countDocuments(filter),
		]);

		const items = docs.map((doc: MentorDocument) => {
			const mentor = this.toDomain(doc);
			return {
				...mentor,
				user: doc.userId as unknown as {
					name: string;
					email: string;
					avatar?: string;
				},
				currentRoleDetails: doc.currentRoleId as unknown as { name: string },
				expertisesDetails: (doc.areasOfExpertise || []).map((e: unknown) => {
					const exp = e as unknown as {
						_id?: string;
						id?: string;
						name?: string;
					};
					return {
						id: exp._id?.toString() || exp.id?.toString(),
						name: exp.name,
					};
				}),
				skillsDetails: (doc.toolsAndSkills || []).map((ts: unknown) => {
					const skill = ts as unknown as {
						skillId?: { name?: string; interestId?: string };
						level?: string;
					};
					return {
						skillId: {
							name: skill.skillId?.name,
							interestId: skill.skillId?.interestId?.toString(),
						},
						level: skill.level,
					};
				}),
			} as MentorApplicationDetails;
		});

		return this.buildPaginatedResult<MentorApplicationDetails>(
			items,
			total,
			page,
			limit,
		);
	}

	async approve(id: string): Promise<Mentor | null> {
		const doc = await this.model
			.findByIdAndUpdate(
				id,
				{ isApproved: true, isRejected: false, rejectionReason: null },
				{ returnDocument: "after" },
			)
			.lean();
		return doc ? this.toDomain(doc as MentorDocument) : null;
	}

	async reject(id: string, reason: string): Promise<Mentor | null> {
		const doc = await this.model
			.findByIdAndUpdate(
				id,
				{ isApproved: false, isRejected: true, rejectionReason: reason },
				{ returnDocument: "after" },
			)
			.lean();
		return doc ? this.toDomain(doc as MentorDocument) : null;
	}
}
