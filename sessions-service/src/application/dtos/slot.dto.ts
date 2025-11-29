import { Slot } from "../../domain/entities/slot.entity";

export interface createCustomSlotDto {
	mentorId: string;
	startAt: Date;
	endAt: Date;
	slotDuration: number;
}

export interface getMentorSlotsDto {
	mentorId: string;
}

export interface getMentorSlotsResponse {
	slots: Slot[];
}

export interface cancelSlotDto {
	mentorId: string;
	slotId: string;
}
export interface getMentorRule {
	mentorId: string;
}
