import { Slot } from "../../domain/entities/slot.entity";

export interface CreateCustomSlotDto {
	mentorId: string;
	startAt: Date;
	endAt: Date;
	slotDuration: number;
}

export interface GetMentorSlotsDto {
	mentorId: string;
}

export interface GetMentorSlotsResponse {
	slots: Slot[];
}

export interface CancelSlotDto {
	mentorId: string;
	slotId: string;
}
export interface GetMentorRule {
	mentorId: string;
}
