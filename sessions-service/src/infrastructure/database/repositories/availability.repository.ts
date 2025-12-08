import type { Availability } from "../../../domain/entities/availability.entity";
import type { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import {
	availabilityModel,
	type IAvailability,
} from "../models/availability.model";
import { BaseRepository } from "./base.repository";

export class AvailabilityRepository
	extends BaseRepository<Availability, IAvailability>
	implements IAvailabilityRepository
{
	constructor() {
		super(availabilityModel);
	}

	protected mapToDomain(doc: IAvailability): Availability {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			mentorId: mapped.mentorId,
			recurringRules: mapped.recurringRules,
			price: mapped.price,
			createdAt: mapped.createdAt,
		};
	}

	async findByMentorId(mentorId: string): Promise<Availability | null> {
		const doc = await this._model.findOne({ mentorId });
		return doc ? this.mapToDomain(doc) : null;
	}

	async fetchOrCreateByMentorId(mentorId: string): Promise<Availability> {
		const doc = await this._model.findOneAndUpdate(
			{ mentorId },
			{ $setOnInsert: { mentorId } },
			{ upsert: true, new: true },
		);

		return this.mapToDomain(doc);
	}
}
