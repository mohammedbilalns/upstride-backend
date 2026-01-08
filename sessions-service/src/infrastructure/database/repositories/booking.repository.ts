import type { Booking } from "../../../domain/entities/booking.entity";
import type { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { bookingModel, type IBooking } from "../models/booking.model";
import { BaseRepository } from "./base.repository";

export class BookingRepository
	extends BaseRepository<Booking, IBooking>
	implements IBookingRepository
{
	constructor() {
		super(bookingModel);
	}

	protected mapToDomain(doc: IBooking): Booking {
		const mapped = mapMongoDocument(doc)!;
		const booking: Booking = {
			id: mapped.id,
			slotId: mapped.slotId, // This might be an object if populated
			userId: mapped.userId,
			status: mapped.status,
			paymentId: mapped.paymentId,
			rescheduleRequest: mapped.rescheduleRequest,
			createdAt: mapped.createdAt,
		};

		// Handle slot population
		// 1. Aggregation case: 'slot' field added via $lookup
		if ("slot" in doc) {
			booking.slot = (doc as any).slot;
		}
		// 2. Mongoose populate case: slotId field replaced by object
		else if (
			doc.slotId &&
			typeof doc.slotId === "object" &&
			"mentorId" in doc.slotId
		) {
			booking.slot = doc.slotId as any;
			// Reset slotId to string ID just in case domain expects string ID
			// But domain interface says `slotId: string`, so we should probably keep it as string ID
			// However `mapped.slotId` likely handles it if `mapMongoDocument` does `obj._id.toString()`.
			// If `slotId` was populated, `doc.toObject()` might have legacy behavior.
			// Let's rely on standard mapping but add `slot`.
		}

		// If slotId is an object (populated or Buffer/ObjectId), ensure it's a string
		if (booking.slotId && typeof booking.slotId === "object") {
			const slotObj = booking.slotId as any;
			// Handle populated object with id/_id
			if (slotObj.id || slotObj._id) {
				booking.slotId = slotObj.id || slotObj._id.toString();
			}
			// Handle Buffer/ObjectId directly
			else if (slotObj.toString) {
				// specific check for Buffer if needed, usually toString() works for ObjectId
				booking.slotId = slotObj.toString();
			}
		}

		return booking;
	}

	public async findByMentorId(mentorId: string): Promise<Booking[]> {
		const docs = await this._model.aggregate([
			{
				$lookup: {
					from: "slots",
					localField: "slotId",
					foreignField: "_id",
					as: "slot",
				},
			},
			{ $unwind: "$slot" },
			{ $match: { "slot.mentorId": mentorId } },
		]);
		return docs.map((doc) => this.mapToDomain(doc));
	}

	public async updateRescheduleStatus(
		bookingId: string,
		status: "PENDING" | "REJECTED" | "APPROVED",
		requestDetails?: any,
	): Promise<Booking | null> {
		const update: any = {
			"rescheduleRequest.status": status,
		};
		if (requestDetails) {
			update.rescheduleRequest = {
				...requestDetails,
				status,
			};
		}
		const doc = await this._model.findByIdAndUpdate(
			bookingId,
			{ $set: update },
			{ new: true },
		);
		return doc ? this.mapToDomain(doc) : null;
	}

	public async findByPaymentId(paymentId: string): Promise<Booking | null> {
		const doc = await this._model.findOne({ paymentId });
		return doc ? this.mapToDomain(doc) : null;
	}

	public async findByUserId(userId: string): Promise<Booking[]> {
		// Populate slotId to get slot details for regular find
		const docs = await this._model.find({ userId }).populate("slotId").exec();
		return docs.map((doc) => this.mapToDomain(doc));
	}

	public async findUpcoming(
		id: string,
		role: "user" | "mentor",
	): Promise<Booking[]> {
		// Optimized pipeline
		const pipeline: any[] = [
			{
				$lookup: {
					from: "slots",
					localField: "slotId",
					foreignField: "_id",
					as: "slot",
				},
			},
			{ $unwind: "$slot" },
			{ $match: { "slot.startAt": { $gte: new Date() } } }, // Future dates
		];

		// Add role-based specific match
		const roleMatch: any = { status: { $in: ["CONFIRMED", "PENDING"] } };
		if (role === "user") {
			roleMatch.userId = id;
		} else {
			roleMatch["slot.mentorId"] = id;
		}

		pipeline.push({ $match: roleMatch });
		pipeline.push({ $sort: { "slot.startAt": 1 } });

		const docs = await this._model.aggregate(pipeline);
		return docs.map((doc) => this.mapToDomain(doc));
	}

	public async findHistory(
		id: string,
		role: "user" | "mentor",
	): Promise<Booking[]> {
		const pipeline: any[] = [
			{
				$lookup: {
					from: "slots",
					localField: "slotId",
					foreignField: "_id",
					as: "slot",
				},
			},
			{ $unwind: "$slot" },
			{ $match: { "slot.endAt": { $lt: new Date() } } },
		];

		const roleMatch: any = {};
		if (role === "user") {
			roleMatch.userId = id;
		} else {
			roleMatch["slot.mentorId"] = id;
		}

		pipeline.push({ $match: roleMatch });
		pipeline.push({ $sort: { "slot.startAt": -1 } }); // Newest history first

		const docs = await this._model.aggregate(pipeline);
		return docs.map((doc) => this.mapToDomain(doc));
	}
}
