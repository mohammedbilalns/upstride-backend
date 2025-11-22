import { IAvailability, availabilityModel } from "../models/availability.model";
import { BaseRepository } from "./base.repository";
import { Availability } from "../../../domain/entities/availability.entity";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";

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
			customRanges: mapped.customRanges,
			exeptionRanges: mapped.exeptionRanges,
			price: mapped.price,
			createdAt: mapped.createdAt,
		};
	}
}
