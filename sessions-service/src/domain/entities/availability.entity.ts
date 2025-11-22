export interface Availability {
	id: string;
	mentorId: string;
	recurringRules: {
		weekDay: Number;
		startTime: Date;
		endTime: Date;
		slotDuration: Number;
		isActive: Boolean;
	};
	customRanges: {
		startAt: Date;
		endAt: Date;
		slotDuration: Number;
		isActive: boolean;
	};
	exeptionRanges: [
		{
			startAt: Date;
			endAt: Date;
			// reason and weekdays needed  ?
		},
	];
	price: Number;
	createdAt: Date;
}
