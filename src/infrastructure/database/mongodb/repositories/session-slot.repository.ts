import { injectable } from "inversify";
import type { SessionSlot } from "../../../../domain/entities/session-slot.entity";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { SessionSlotMapper } from "../mappers/session-slot.mapper";
import {
	type SessionSlotDocument,
	SessionSlotModel,
} from "../models/session-slot.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoSessionSlotRepository
	extends AbstractMongoRepository<SessionSlot, SessionSlotDocument>
	implements ISessionSlotRepository
{
	constructor() {
		super(SessionSlotModel);
	}

	protected toDomain(doc: SessionSlotDocument): SessionSlot {
		return SessionSlotMapper.toDomain(doc);
	}

	protected toDocument(entity: SessionSlot): Partial<SessionSlotDocument> {
		return SessionSlotMapper.toDocument(entity);
	}

	async create(entity: SessionSlot): Promise<SessionSlot> {
		return this.createDocument(entity);
	}

	async findById(id: string): Promise<SessionSlot | null> {
		return this.findByIdDocument(id);
	}

	async findByMentorId(mentorId: string): Promise<SessionSlot[]> {
		const docs = await this.model.find({ mentorId }).lean();
		return docs.map((doc) => this.toDomain(doc as SessionSlotDocument));
	}

	async findByMentorIdAndRange(
		mentorId: string,
		startDate: Date,
		endDate: Date,
	): Promise<SessionSlot[]> {
		const docs = await this.model
			.find({
				mentorId,
				startTime: { $gte: startDate, $lte: endDate },
			})
			.lean();
		return docs.map((doc) => this.toDomain(doc as SessionSlotDocument));
	}

	async updateById(
		id: string,
		data: Partial<SessionSlot>,
	): Promise<SessionSlot | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, data, { returnDocument: "after" })
			.lean();
		return doc ? this.toDomain(doc as SessionSlotDocument) : null;
	}

	async deleteById(id: string): Promise<void> {
		await this.model.findByIdAndDelete(id).lean();
	}
}
