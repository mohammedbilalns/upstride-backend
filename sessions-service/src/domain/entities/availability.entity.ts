export interface Availability {
	id: string;
	mentorId: string;
	recurringRules: {
		ruleId: string;
		weekDay: number;
		startTime: number;
		endTime: number;
		slotDuration: 60 | 90 | 120 | 180;
		price: number;
		isActive?: boolean;
	}[];
	price: number;
	createdAt: Date;
}
