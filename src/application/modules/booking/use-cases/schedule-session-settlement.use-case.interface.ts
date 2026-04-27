export interface ScheduleSessionSettlementInput {
	bookingId: string;
	endTime: Date;
}

export interface IScheduleSessionSettlementUseCase {
	execute(input: ScheduleSessionSettlementInput): Promise<void>;
}
