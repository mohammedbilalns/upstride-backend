export interface Availability {
	id: string;
	mentorId: string;
	recurringRules: {
		ruleId: string;
		weekDay: number;
		startTime: Date;
		endTime: Date;
		slotDuration: number;
		isActive?: boolean;
	}[];
	exeptionRanges: [
		{
			startAt: Date;
			endAt: Date;
		},
	];
	price: number;
	createdAt: Date;
}
