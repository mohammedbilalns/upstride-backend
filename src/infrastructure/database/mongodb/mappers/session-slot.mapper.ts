import { Types } from "mongoose";
import { SessionSlot } from "../../../../domain/entities/session-slot.entity";
import type { SessionSlotDocument } from "../models/session-slot.model";

export class SessionSlotMapper {
	static toDomain(doc: SessionSlotDocument): SessionSlot {
		return new SessionSlot(
			doc._id.toString(),
			doc.mentorId.toString(),
			doc.startTime,
			doc.endTime,
			doc.durationMinutes,
			doc.price,
			doc.currency,
			doc.status,
			doc.bookingId?.toString?.() ?? null,
			doc.createdFromRuleId ?? null,
		);
	}

	static toDocument(entity: SessionSlot): Partial<SessionSlotDocument> {
		return {
			mentorId: new Types.ObjectId(entity.mentorId),
			startTime: entity.startTime,
			endTime: entity.endTime,
			durationMinutes: entity.durationMinutes,
			price: entity.price,
			currency: entity.currency,
			status: entity.status,
			bookingId: entity.bookingId
				? new Types.ObjectId(entity.bookingId)
				: undefined,
			createdFromRuleId: entity.createdFromRuleId ?? undefined,
		};
	}
}
