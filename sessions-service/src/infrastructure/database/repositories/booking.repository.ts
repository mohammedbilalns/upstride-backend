import { BaseRepository } from "./base.repository";
import { Booking } from "../../../domain/entities/booking.entity";
import { IBooking, bookingModel } from "../models/booking.model";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";

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
}
