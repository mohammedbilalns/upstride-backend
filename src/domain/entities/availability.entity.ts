import { isValidTimeRange } from "../../shared/utilities/time.util";
import { EntityValidationError } from "../errors";
import { validateBreaks } from "../utilties/validate-availability-breaktime";

export interface BreakTime {
	startTime: string;
	endTime: string;
}

export const Day = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
] as const;
export type Day = (typeof Day)[number];

export const SlotDuration = [30, 60] as const;
export type SlotDuration = (typeof SlotDuration)[number];

export class Availability {
	constructor(
		public readonly id: string,
		public readonly mentorId: string,
		public readonly name: string,
		public readonly description: string,
		public readonly days: Set<Day>,
		public readonly startTime: string,
		public readonly endTime: string,
		public readonly startDate: string,
		public readonly endDate: string,
		public readonly breakTimes: BreakTime[],
		public readonly slotDuration: SlotDuration,
		public readonly bufferTime: number,
		public readonly priority: number,
		public readonly status: boolean,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}

	static create(
		data: Omit<Availability, "id" | "createdAt" | "updatedAt">,
	): Omit<Availability, "id" | "createdAt" | "updatedAt"> {
		if (data.days.size === 0) {
			throw new EntityValidationError(
				"Availability",
				"Atleast one day must be selected",
			);
		}
		if (!isValidTimeRange(data.startTime, data.endTime)) {
			throw new Error("Invalid time range");
		}

		if (data.bufferTime < 0) {
			throw new EntityValidationError(
				"Availability",
				"Buffer time cannot be negative",
			);
		}

		if (data.bufferTime >= data.slotDuration) {
			throw new EntityValidationError(
				"Availability",
				"Buffer time must be less than slot duration",
			);
		}
		const breakValidationError = validateBreaks(
			data.breakTimes,
			data.startTime,
			data.endTime,
		);

		if (breakValidationError) {
			throw new EntityValidationError("Availability", breakValidationError);
		}

		return data;
	}
}
