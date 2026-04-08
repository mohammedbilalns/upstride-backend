import { injectable } from "inversify";
import type { Booking } from "../../../../domain/entities/booking.entity";
import type {
	BookingFilter,
	IBookingRepository,
} from "../../../../domain/repositories/booking.repository.interface";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities";
import { getUtcRangeForIstDate } from "../../../../shared/utilities/time.util";
import { BookingMapper } from "../mappers/booking.mapper";
import { BookingModel } from "../models/booking.model";

@injectable()
export class BookingRepository implements IBookingRepository {
	async create(entity: Booking): Promise<Booking> {
		const doc = await BookingModel.create({
			_id: entity.id,
			...BookingMapper.toPersistence(entity),
		});
		return BookingMapper.toDomain(doc);
	}

	async findById(id: string): Promise<Booking | null> {
		const doc = await BookingModel.findById(id)
			.populate({
				path: "mentorId",
				select: "userId",
				populate: { path: "userId", select: "name" },
			})
			.populate({
				path: "menteeId",
				select: "name",
			})
			.lean();
		return doc ? BookingMapper.toDomain(doc) : null;
	}

	async findOverlapping(
		mentorId: string,
		startTime: Date,
		endTime: Date,
	): Promise<Booking[]> {
		const docs = await BookingModel.find({
			mentorId,
			status: { $in: ["PENDING", "CONFIRMED"] },
			startTime: { $lt: endTime },
			endTime: { $gt: startTime },
		}).lean();
		return docs.map((d) => BookingMapper.toDomain(d));
	}

	async findByMentorIdAndDate(
		mentorId: string,
		date: Date,
	): Promise<Booking[]> {
		const { start: startOfDay, end: endOfDay } = getUtcRangeForIstDate(date);

		const docs = await BookingModel.find({
			mentorId,
			status: { $in: ["PENDING", "CONFIRMED", "COMPLETED"] },
			startTime: { $gte: startOfDay, $lte: endOfDay },
		}).lean();
		return docs.map((d) => BookingMapper.toDomain(d));
	}

	async updateById(
		id: string,
		update: Partial<Booking>,
	): Promise<Booking | null> {
		const doc = await BookingModel.findByIdAndUpdate(
			id,
			{ $set: update },
			{ new: true },
		).lean();
		return doc ? BookingMapper.toDomain(doc) : null;
	}

	private buildFilter(
		field: "menteeId" | "mentorId",
		value: string,
		filter: BookingFilter,
	) {
		const base: Record<string, unknown> = { [field]: value };
		const now = new Date();
		if (filter === "upcoming")
			return {
				...base,
				startTime: { $gt: now },
				status: { $in: ["CONFIRMED", "PENDING"] },
			};
		if (filter === "payment_pending")
			return {
				...base,
				startTime: { $gt: now },
				status: { $in: ["CONFIRMED", "PENDING"] },
				paymentType: "STRIPE",
				paymentStatus: { $ne: "COMPLETED" },
			};
		if (filter === "past") return { ...base, endTime: { $lt: now } };
		if (filter === "cancelled")
			return {
				...base,
				status: { $in: ["CANCELLED_BY_MENTEE", "CANCELLED_BY_MENTOR"] },
			};
		return base;
	}

	async paginateByMentee(
		menteeId: string,
		filter: BookingFilter,
		page: number,
		limit: number,
	): Promise<PaginatedResult<Booking>> {
		return this._paginate("menteeId", menteeId, filter, page, limit);
	}

	async paginateByMentor(
		mentorId: string,
		filter: BookingFilter,
		page: number,
		limit: number,
	): Promise<PaginatedResult<Booking>> {
		return this._paginate("mentorId", mentorId, filter, page, limit);
	}

	private async _paginate(
		field: "menteeId" | "mentorId",
		value: string,
		filter: BookingFilter,
		page: number,
		limit: number,
	): Promise<PaginatedResult<Booking>> {
		const query = this.buildFilter(field, value, filter);
		const skip = (page - 1) * limit;
		const [docs, total] = await Promise.all([
			BookingModel.find(query)
				.populate({
					path: "mentorId",
					select: "userId",
					populate: { path: "userId", select: "name" },
				})
				.populate({
					path: "menteeId",
					select: "name",
				})
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			BookingModel.countDocuments(query),
		]);
		return {
			items: docs.map((d) => BookingMapper.toDomain(d)),
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}
}
