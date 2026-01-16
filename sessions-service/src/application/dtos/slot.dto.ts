import { Slot } from "../../domain/entities/slot.entity";

import type { AllowedDuration } from "./pricing-config.dto";

export interface CreateCustomSlotDto {
	mentorId: string;
	startAt: Date;
	endAt: Date;
	slotDuration: AllowedDuration;
}

export interface GetMentorSlotsDto {
	mentorId: string;
	availableOnly?: boolean;
	month?: number;
	year?: number;
	userId?: string;
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

export interface DeleteSlotDto {
	mentorId: string;
	slotId: string;
}
