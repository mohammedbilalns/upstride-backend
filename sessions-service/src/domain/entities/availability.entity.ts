export interface Availability {
	id: string;
	mentorId: string;
	recurringRules: {
		ruleId: string;
		weekDay: number;
		startTime: number;
		endTime: number;
		slotDuration: number;
		isActive?: boolean;
	}[];
	price: number;
	createdAt: Date;
}
