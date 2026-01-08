import type { Slot } from "../../../domain/entities/slot.entity";
import type { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { type ISlot, slotModel } from "../models/slot.model";
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
			description: mapped.description,
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
			isActive: mapped.isActive,
		};
	}

	public async find(filter: Partial<Slot>): Promise<Slot[]> {
		const data = await this._model.find(filter);
		return data.map(this.mapToDomain);
	}

	public async findUpcomingByMentor(
		mentorId: string,
		now: Date = new Date(),
	): Promise<Slot[]> {
		const docs = await this._model.find({
			mentorId,
			isActive: true,
			status: "OPEN",
			startAt: { $gt: now },
		});

		return docs.map(this.mapToDomain);
	}

	public async findOverlappingSlots(
		mentorId: string,
		startAt: Date,
		endAt: Date,
	): Promise<Slot | null> {
		const docs = await this._model
			.findOne({
				mentorId,
				$and: [{ startAt: { $lt: endAt } }, { endAt: { $gt: startAt } }],
			})
			.exec();

		return docs ? this.mapToDomain(docs) : null;
	}

	public async deleteExpiredOpenSlots(): Promise<number> {
		const result = await this._model.deleteMany({
			status: "OPEN",
			endAt: { $lt: new Date() },
		});
		return result.deletedCount;
	}

	public async toggleSlotStatusByRuleId(
		ruleId: string,
		isActive: boolean,
	): Promise<void> {
		console.log("toggling status ...");
		await this._model.updateMany(
			{ ruleId: ruleId },
			{ $set: { isActive: isActive } },
		);
		console.log("toggled status ...");
	}

	public async deleteUnbookedFutureSlots(ruleId: string): Promise<void> {
		await this._model.deleteMany({
			ruleId: ruleId,
			status: "OPEN",
			startAt: { $gt: new Date() },
		});
	}
}
