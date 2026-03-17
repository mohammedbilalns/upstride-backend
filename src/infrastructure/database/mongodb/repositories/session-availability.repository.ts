import { injectable } from "inversify";
import type { Availability } from "../../../../domain/entities/session-availability.entity";
import type { ISessionAvailabilityRepository } from "../../../../domain/repositories/session-availability.repository.interface";
import { SessionAvailabilityMapper } from "../mappers/session-availability.mapper";
import {
	type SessionAvailabilityDocument,
	SessionAvailabilityModel,
} from "../models/session-availability.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoSessionAvailabilityRepository
	extends AbstractMongoRepository<Availability, SessionAvailabilityDocument>
	implements ISessionAvailabilityRepository
{
	constructor() {
		super(SessionAvailabilityModel);
	}

	protected toDomain(doc: SessionAvailabilityDocument): Availability {
		return SessionAvailabilityMapper.toDomain(doc);
	}

	protected toDocument(
		entity: Availability,
	): Partial<SessionAvailabilityDocument> {
		return SessionAvailabilityMapper.toDocument(entity);
	}

	async create(entity: Availability): Promise<Availability> {
		return this.createDocument(entity);
	}

	async findById(id: string): Promise<Availability | null> {
		return this.findByIdDocument(id);
	}

	async findByOwnerId(mentorId: string): Promise<Availability | null> {
		const doc = await this.model.findOne({ mentorId }).lean();
		return doc ? this.toDomain(doc as SessionAvailabilityDocument) : null;
	}

	async updateById(
		id: string,
		data: Partial<Availability>,
	): Promise<Availability | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, data, { returnDocument: "after" })
			.lean();
		return doc ? this.toDomain(doc as SessionAvailabilityDocument) : null;
	}
}
