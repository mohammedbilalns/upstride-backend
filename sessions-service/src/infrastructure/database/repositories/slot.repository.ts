import { Slot } from "../../../domain/entities/slot.entity";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { ISlot, slotModel } from "../models/slot.model";
import { BaseRepository } from "./base.repository";

export class SlotRepository
	extends BaseRepository<Slot, ISlot>
	implements ISlotRepository
{
	constructor() {
		super(slotModel);
	}

	protected mapToDomain(doc: ISlot): Slot {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			mentorId: mapped.mentorId,
			startAt: mapped.startAt,
			endAt: mapped.endAt,
			generatedFrom: mapped.generatedFrom,
			status: mapped.status,
			price: mapped.price,
			participantId: mapped.participantId,
			cancelledAt: mapped.cancelledAt,
			cancelledBy: mapped.cancelledBy,
			cancelReason: mapped.cancelReason,
			createdAt: mapped.createdAt,
		};
	}
}
