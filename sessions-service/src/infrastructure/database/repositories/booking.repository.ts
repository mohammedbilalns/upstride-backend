import type { Booking } from "../../../domain/entities/booking.entity";
import type { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { bookingModel, type IBooking } from "../models/booking.model";
import { BaseRepository } from "./base.repository";

export class BookingRepository
	extends BaseRepository<Booking, IBooking>
	implements IBookingRepository {
	constructor() {
		super(bookingModel);
	}

	private stringifyId(id: any): string {
		if (!id) return id;
		if (typeof id === 'string') return id;
		if (id.id) return id.id;
		if (id._id) return id._id.toString();
		if (typeof id.toHexString === 'function') return id.toHexString();
		if (Buffer.isBuffer(id)) return id.toString('hex');
		if (id._bsontype === 'Binary' && id.buffer) return id.buffer.toString('hex');
		return String(id);
	}

	protected mapToDomain(doc: IBooking): Booking {
		const mapped = mapMongoDocument(doc)!;
		const booking: Booking = {
			id: mapped.id,
			slotId: this.stringifyId(mapped.slotId),
			userId: mapped.userId,
			status: mapped.status,
			paymentId: mapped.paymentId,
			rescheduleRequest: mapped.rescheduleRequest,
			createdAt: mapped.createdAt,
		};

		// Handle slot population
		if ("slot" in doc) {
			const slotRaw = (doc as any).slot;
			if (slotRaw && typeof slotRaw === 'object' && '__v' in slotRaw) {
				delete slotRaw.__v;
			}
			booking.slot = slotRaw;
		}
		else if (
			doc.slotId &&
			typeof doc.slotId === "object" &&
			"mentorId" in doc.slotId
		) {
			booking.slot = doc.slotId as any;
		}

		booking.slotId = this.stringifyId(booking.slotId);

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

	public async findBySlotId(slotId: string): Promise<Booking | null> {
		const doc = await this._model.findOne({ slotId }).sort({ createdAt: -1 });
		return doc ? this.mapToDomain(doc) : null;
	}



	public async findByUserId(userId: string): Promise<Booking[]> {
		const docs = await this._model.find({ userId }).populate("slotId").exec();
		return docs.map((doc) => this.mapToDomain(doc));
	}

	public async findUpcoming(
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
			{ $match: { "slot.startAt": { $gte: new Date() } } },
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
		pipeline.push({ $sort: { "slot.startAt": -1 } });

		const docs = await this._model.aggregate(pipeline);
		return docs.map((doc) => this.mapToDomain(doc));
	}

	public async findUserSessions(
		userId: string,
		type: "upcoming" | "history",
		page: number,
		limit: number,
		mentorId?: string
	): Promise<{ sessions: Booking[]; total: number }> {
		const skip = (page - 1) * limit;
		const now = new Date();

		const matchStage: any = {};

		if (type === "upcoming") {
			matchStage["slot.startAt"] = { $gte: now };
			matchStage["status"] = { $in: ["CONFIRMED", "PENDING", "RESERVED"] };
		} else {
			matchStage["$or"] = [
				//  Completed sessions
				{ "status": "COMPLETED" },

				//  Confirmed sessions in the past
				{
					"status": "CONFIRMED",
					"slot.endAt": { $lt: now }
				},

				//  Cancelled sessions that have a valid payment (excluding 'PENDING' or missing)
				{
					"status": "CANCELLED",
					"paymentId": { $exists: true, $nin: ["PENDING", null, ""] }
				}
			];
		}

		// If user is a mentor  check if they are either the participant OR the mentor
		const orConditions: any[] = [{ userId: userId }];
		if (mentorId) {
			orConditions.push({ "slot.mentorId": mentorId });
		}


		// Combine match criteria
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
			{
				$match: {
					...matchStage,
					$or: orConditions
				}
			},
			{
				$sort: { "slot.startAt": type === 'upcoming' ? 1 : -1 }
			},
			{
				$facet: {
					metadata: [{ $count: "total" }],
					data: [{ $skip: skip }, { $limit: limit }]
				}
			}
		];

		const result = await this._model.aggregate(pipeline);

		const total = result[0].metadata[0]?.total || 0;
		const docs = result[0].data || [];

		return {
			sessions: docs.map((doc: any) => this.mapToDomain(doc)),
			total
		};
	}
}
