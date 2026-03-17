import { injectable } from "inversify";
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
}
