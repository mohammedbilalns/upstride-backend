import type {
	Day,
	SlotDuration,
} from "../../../../domain/entities/availability.entity";
import { Availability } from "../../../../domain/entities/availability.entity";
import { toDateString, toHHMM } from "../../../../shared/utilities/time.util";
import type { AvailabilityDocument } from "../models/availability.model";

export class AvailabilityMapper {
	static toDomain(doc: AvailabilityDocument): Availability {
		return new Availability(
			doc._id.toString(),
			doc.mentorId.toString(),
			doc.name,
			doc.description,
			new Set<Day>(doc.days),
			toHHMM(doc.startTime),
			toHHMM(doc.endTime),
			toDateString(doc.startDate),
			toDateString(doc.endDate),
			doc.breakTimes.map((b) => ({
				startTime: toHHMM(b.startTime),
				endTime: toHHMM(b.endTime),
			})),
			doc.slotDuration as SlotDuration,
			doc.bufferTime,
			doc.status,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	private static hhmmToDate(hhmm: string): Date {
		const [h, m] = hhmm.split(":").map(Number);
		const d = new Date(0);
		d.setUTCHours(h, m, 0, 0);
		return d;
	}

	private static dateStringToDate(dateStr: string): Date {
		return new Date(`${dateStr}T00:00:00.000Z`);
	}

	static toPersistence(
		entity: Omit<Availability, "id" | "createdAt" | "updatedAt">,
	) {
		return {
			mentorId: entity.mentorId,
			name: entity.name,
			description: entity.description,
			days: Array.from(entity.days),
			startTime: AvailabilityMapper.hhmmToDate(entity.startTime),
			endTime: AvailabilityMapper.hhmmToDate(entity.endTime),
			startDate: AvailabilityMapper.dateStringToDate(entity.startDate),
			endDate: AvailabilityMapper.dateStringToDate(entity.endDate),
			breakTimes: entity.breakTimes.map((b) => ({
				startTime: AvailabilityMapper.hhmmToDate(b.startTime),
				endTime: AvailabilityMapper.hhmmToDate(b.endTime),
			})),
			slotDuration: entity.slotDuration,
			bufferTime: entity.bufferTime,
			status: entity.status,
		};
	}
}
