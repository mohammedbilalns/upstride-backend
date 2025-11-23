export interface Availability {
	id: string;
	mentorId: string;
	recurringRules: {
		weekDay: number;
		startTime: Date;
		endTime: Date;
		slotDuration: number;
		isActive: boolean;
	};
	customRanges: {
		startAt: Date;
		endAt: Date;
		slotDuration: number;
		isActive: boolean;
	};
	exeptionRanges: [
		{
			startAt: Date;
			endAt: Date;
			// reason and weekdays needed  ?
		},
	];
	price: number;
	createdAt: Date;
}
