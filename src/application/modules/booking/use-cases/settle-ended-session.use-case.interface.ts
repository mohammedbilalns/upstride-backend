export interface SettleEndedSessionInput {
	bookingId: string;
}

export interface ISettleEndedSessionUseCase {
	execute(input: SettleEndedSessionInput): Promise<void>;
}
