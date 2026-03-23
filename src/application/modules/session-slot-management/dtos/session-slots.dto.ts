export interface CancelSlotInput {
	userId: string;
	slotId: string;
}

export interface CancelSlotResponse {
	slotId: string;
	status: "blocked";
}

export interface EnableSlotInput {
	userId: string;
	slotId: string;
}

export interface EnableSlotResponse {
	slotId: string;
	status: "available";
}

export interface DeleteSlotInput {
	userId: string;
	slotId: string;
}

export interface DeleteSlotResponse {
	slotId: string;
}

export interface CreateCustomSlotInput {
	userId: string;
	startTime: string;
	endTime: string;
	durationMinutes: 30 | 60;
}

export interface CreateCustomSlotResponse {
	slotId: string;
}

export interface GenerateSlotsInput {
	mentorId: string;
	startDate?: string;
	endDate?: string;
}

export interface GenerateSlotsResponse {
	createdCount: number;
}

export interface GetMentorSlotsInput {
	userId: string;
	startDate?: string;
	endDate?: string;
}

export interface MentorSlotDto {
	id: string;
	startTime: Date;
	endTime: Date;
	durationMinutes: number;
	price: number;
	status: "available" | "booked" | "blocked";
	bookingId: string | null;
	createdFromRuleId: string | null;
}

export interface GetMentorSlotsResponse {
	slots: MentorSlotDto[];
}
