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
		return {
			id: mapped.id,
			slotId: mapped.slotId,
			userId: mapped.userId,
			status: mapped.status,
			paymentId: mapped.paymentId,
			createdAt: mapped.createdAt,
		};
	}

	public async findByPaymentId(paymentId: string): Promise<Booking | null> {
		const doc = await this._model.findOne({ paymentId });
		return doc ? this.mapToDomain(doc) : null;
	}

	public async findByUserId(userId: string): Promise<Booking[]> {
		const docs = await this._model.find({ userId }).populate("slotId").exec();
		return docs.map((doc) => this.mapToDomain(doc));
	}

	public async findUpcomingByUserId(userId: string): Promise<Booking[]> {
		// Find bookings where associated slot start time is in the future

		const docs = await this._model.aggregate([
			{ $match: { userId: userId, status: "CONFIRMED" } },
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
		]);

		return docs.map((doc) => this.mapToDomain(doc));
	}
}
