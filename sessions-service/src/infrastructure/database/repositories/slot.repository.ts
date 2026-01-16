import type { Slot } from "../../../domain/entities/slot.entity";
import type { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { type ISlot, slotModel } from "../models/slot.model";
import { BaseRepository } from "./base.repository";

export class SlotRepository
	extends BaseRepository<Slot, ISlot>
	implements ISlotRepository {
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
		startDate?: Date,
		endDate?: Date,
		userId?: string,
	): Promise<Slot[]> {
		const query: any = {
			mentorId,
			isActive: true,
			startAt: { $gt: now },
			$or: [
				{ status: "OPEN" },
				...(userId ? [{ status: "RESERVED", participantId: userId }] : []),
				...(userId ? [{ status: "FULL", participantId: userId }] : []),
			],
		};

		if (startDate) {
			query.startAt.$gte = startDate;
		}

		if (endDate) {
			query.startAt.$lte = endDate;
		}

		const docs = await this._model.find(query);

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
		await this._model.updateMany(
			{ ruleId: ruleId },
			{ $set: { isActive: isActive } },
		);
	}

	public async deleteUnbookedFutureSlots(ruleId: string): Promise<void> {
		await this._model.deleteMany({
			ruleId: ruleId,
			status: "OPEN",
			startAt: { $gt: new Date() },
		});
	}

	public async updatePriceForFutureSlots(
		mentorId: string,
		durationInMinutes: number,
		newPrice: number,
	): Promise<void> {
		const durationMs = durationInMinutes * 60 * 1000;

		await this._model.updateMany(
			{
				mentorId,
				status: "OPEN",
				startAt: { $gt: new Date() },
				$expr: {
					$eq: [{ $subtract: ["$endAt", "$startAt"] }, durationMs],
				},
			},
			{
				$set: { price: newPrice },
			},
		);
	}

	public async findInTimeRange(
		start: Date,
		end: Date,
		status?: string,
	): Promise<Slot[]> {
		const query: any = {
			startAt: { $gte: start, $lt: end },
		};
		if (status) {
			query.status = status;
		}
		const docs = await this._model.find(query);
		return docs.map(this.mapToDomain);
	}

	public async countFutureSlotsByMentor(mentorId: string): Promise<number> {
		return this._model.countDocuments({
			mentorId,
			status: "OPEN",
			startAt: { $gt: new Date() },
		});
	}
}
