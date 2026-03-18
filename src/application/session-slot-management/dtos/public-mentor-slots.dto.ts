export interface GetPublicMentorAvailableSlotsInput {
	mentorId: string;
	requesterUserId: string;
	date: string;
}

export interface PublicMentorAvailableSlotDto {
	id: string;
	startTime: Date;
	endTime: Date;
	durationMinutes: number;
	price: number;
	currency: "coins";
}

export interface GetPublicMentorAvailableSlotsResponse {
	slots: PublicMentorAvailableSlotDto[];
}
