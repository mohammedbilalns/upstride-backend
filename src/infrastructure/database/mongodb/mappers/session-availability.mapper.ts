import { Types } from "mongoose";
import {
	Availability,
	type AvailabilityRule,
} from "../../../../domain/entities/session-availability.entity";
import type { SessionAvailabilityDocument } from "../models/session-availability.model";

export class SessionAvailabilityMapper {
	static toDomain(doc: SessionAvailabilityDocument): Availability {
		return new Availability(
			doc._id.toString(),
			doc.recurringRules as AvailabilityRule[],
			doc.mentorId.toString(),
			doc.createdAt,
		);
	}

	static toDocument(
		entity: Availability,
	): Partial<SessionAvailabilityDocument> {
		return {
			mentorId: new Types.ObjectId(entity.mentorId),
			recurringRules: entity.recurringRules.map((rule) => ({
				ruleId: rule.ruleId,
				weekDay: rule.weekDay,
				startTime: rule.startTime,
				endTime: rule.endTime,
				slotDuration: rule.slotDuration,
				isActive: rule.isActive ?? true,
			})),
		};
	}
}
