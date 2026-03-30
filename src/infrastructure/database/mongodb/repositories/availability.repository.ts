import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type {
	Availability,
	Day,
} from "../../../../domain/entities/availability.entity";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import { AvailabilityMapper } from "../mappers/availability.mapper";
import {
	type AvailabilityDocument,
	AvailabilityModel,
} from "../models/availability.model";

@injectable()
export class AvailabilityRepository implements IAvailabilityRepository {
	async create(
		entity: Omit<Availability, "id" | "createdAt" | "updatedAt">,
	): Promise<Availability> {
		const doc = await AvailabilityModel.create(
			AvailabilityMapper.toPersistence(entity),
		);
		return AvailabilityMapper.toDomain(doc);
	}

	async findById(id: string): Promise<Availability | null> {
		const doc = await AvailabilityModel.findById(id).lean();
		return doc ? AvailabilityMapper.toDomain(doc) : null;
	}

	async findByMentorId(
		mentorId: string,
		options: {
			status?: boolean;
			expired?: boolean;
			page?: number;
			limit?: number;
		} = {},
	): Promise<Availability[]> {
		const query = this.buildMentorQuery(mentorId, options);
		const page = options.page ?? 1;
		const limit = options.limit ?? 0;
		const skip = limit > 0 ? (page - 1) * limit : 0;

		let dbQuery = AvailabilityModel.find(query);
		if (limit > 0) {
			dbQuery = dbQuery.skip(skip).limit(limit);
		}

		const docs = await dbQuery.lean();
		return docs.map((d) => AvailabilityMapper.toDomain(d));
	}

	async countByMentorId(
		mentorId: string,
		options: { status?: boolean; expired?: boolean } = {},
	): Promise<number> {
		const query = this.buildMentorQuery(mentorId, options);
		return AvailabilityModel.countDocuments(query);
	}

	private buildMentorQuery(
		mentorId: string,
		options: { status?: boolean; expired?: boolean } = {},
	): QueryFilter<AvailabilityDocument> {
		const query: QueryFilter<AvailabilityDocument> = { mentorId };

		if (typeof options.status === "boolean") {
			query.status = options.status;
		}

		const today = new Date();
		today.setUTCHours(0, 0, 0, 0);

		if (options.expired === true) {
			query.endDate = { $lt: today };
		} else if (options.expired === false) {
			query.endDate = { $gte: today };
		}

		return query;
	}

	async findActiveByMentorIdAndDate(
		mentorId: string,
		date: Date,
	): Promise<Availability[]> {
		const dayNames: Day[] = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		const dayName = dayNames[date.getUTCDay()];

		const startOfDay = new Date(date);
		startOfDay.setUTCHours(0, 0, 0, 0);

		const docs = await AvailabilityModel.find({
			mentorId,
			status: true,
			days: dayName,
			startDate: { $lte: startOfDay },
			endDate: { $gte: startOfDay },
		}).lean();

		return docs.map((d) => AvailabilityMapper.toDomain(d));
	}

	async updateById(
		id: string,
		update: Partial<Availability>,
	): Promise<Availability | null> {
		const persistenceUpdate: Record<string, unknown> = { ...update };

		if (typeof update.startTime === "string") {
			const [h, m] = update.startTime.split(":").map(Number);
			const d = new Date(0);
			d.setUTCHours(h, m, 0, 0);
			persistenceUpdate.startTime = d;
		}
		if (typeof update.endTime === "string") {
			const [h, m] = update.endTime.split(":").map(Number);
			const d = new Date(0);
			d.setUTCHours(h, m, 0, 0);
			persistenceUpdate.endTime = d;
		}
		if (typeof update.startDate === "string") {
			persistenceUpdate.startDate = new Date(
				`${update.startDate}T00:00:00.000Z`,
			);
		}
		if (typeof update.endDate === "string") {
			persistenceUpdate.endDate = new Date(`${update.endDate}T00:00:00.000Z`);
		}
		if (update.days instanceof Set) {
			persistenceUpdate.days = Array.from(update.days);
		}

		const doc = await AvailabilityModel.findByIdAndUpdate(
			id,
			{ $set: persistenceUpdate },
			{ new: true },
		).lean();
		return doc ? AvailabilityMapper.toDomain(doc) : null;
	}

	async updateStatus(id: string, status: boolean): Promise<void> {
		await AvailabilityModel.findByIdAndUpdate(id, { $set: { status } });
	}

	async deleteById(id: string): Promise<void> {
		await this.updateStatus(id, false);
	}
}
