import { EntityValidationError } from "../errors";

export type AllowedDuration = 30 | 60;

export interface AvailabilityRule {
	ruleId: string;
	weekDay: number;
	startTime: number;
	endTime: number;
	slotDuration: AllowedDuration;
	isActive?: boolean;
}

export class Availability {
	constructor(
		public readonly id: string,
		public readonly recurringRules: AvailabilityRule[],
		public readonly mentorId: string,
		public readonly createdAt: Date,
	) {
		for (const rule of recurringRules) {
			if (rule.weekDay < 0 || rule.weekDay > 6) {
				throw new EntityValidationError(
					"Availability",
					"week day must be between 0 and 6",
				);
			}
			if (rule.startTime < 0 || rule.endTime < 0) {
				throw new EntityValidationError(
					"Availability",
					"start and end time must be non-negative",
				);
			}
			if (rule.endTime <= rule.startTime) {
				throw new EntityValidationError(
					"Availability",
					"end time must be after start time",
				);
			}
			if (rule.slotDuration !== 30 && rule.slotDuration !== 60) {
				throw new EntityValidationError(
					"Availability",
					"slot duration must be 30 or 60",
				);
			}
		}
	}
}
