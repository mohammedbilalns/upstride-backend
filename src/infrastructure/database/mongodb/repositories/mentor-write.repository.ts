import { injectable } from "inversify";
import { Types } from "mongoose";
import type { Mentor } from "../../../../domain/entities/mentor.entity";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { MentorMapper } from "../mappers/mentor.mapper";
import { type MentorDocument, MentorModel } from "../models/mentor.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoMentorWriteRepository
	extends AbstractMongoRepository<Mentor, MentorDocument>
	implements IMentorWriteRepository
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

	async updateIsUserBlockedStatusByUserId(
		userId: string,
		isUserBlocked: boolean,
	): Promise<void> {
		await this.model.updateMany({ userId }, { $set: { isUserBlocked } });
	}

	async recordCompletedSession(
		mentorId: string,
		completedAt: Date,
	): Promise<void> {
		await this.model.updateOne(
			{ _id: new Types.ObjectId(mentorId) },
			{
				$inc: { totalSessions: 1 },
				$max: { lastSessionAt: completedAt },
			},
		);
	}
}
