import type { AllowedDuration } from "../../application/dtos/pricing-config.dto";

export interface Availability {
	id: string;
	recurringRules: {
		ruleId: string;
		weekDay: number;
		startTime: number;
		endTime: number;
		slotDuration: AllowedDuration; // Only 30, 60, or 90 minutes
		isActive?: boolean;
	}[];
	mentorId: string;
	createdAt: Date;
}
