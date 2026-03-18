import { Types } from "mongoose";
import { SessionBooking } from "../../../../domain/entities/session-booking.entity";
import type { SessionBookingDocument } from "../models/session-booking.model";

export class SessionBookingMapper {
	static toDomain(doc: SessionBookingDocument): SessionBooking {
		return new SessionBooking(
			doc._id.toString(),
			doc.userId.toString(),
			doc.mentorId.toString(),
			doc.slotId.toString(),
			doc.startTime,
			doc.endTime,
			doc.price,
			doc.status,
			{
				coinsDebited: doc.payment.coinsDebited,
				transactionId: doc.payment.transactionId.toString(),
			},
			{
				roomId: doc.meeting?.roomId,
				joinUrl: doc.meeting?.joinUrl,
			},
			doc.cancellationReason ?? null,
			doc.cancelledBy ?? null,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: SessionBooking): Partial<SessionBookingDocument> {
		return {
			userId: new Types.ObjectId(entity.userId),
			mentorId: new Types.ObjectId(entity.mentorId),
			slotId: new Types.ObjectId(entity.slotId),
			startTime: entity.startTime,
			endTime: entity.endTime,
			price: entity.price,
			status: entity.status,
			payment: {
				coinsDebited: entity.payment.coinsDebited,
				transactionId: new Types.ObjectId(entity.payment.transactionId),
			},
			meeting: {
				roomId: entity.meeting?.roomId,
				joinUrl: entity.meeting?.joinUrl,
			},
			cancellationReason: entity.cancellationReason ?? null,
			cancelledBy: entity.cancelledBy ?? null,
		};
	}
}
