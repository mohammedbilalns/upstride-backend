import type {
	Day,
	SlotDuration,
} from "../../../../domain/entities/availability.entity";

// ──────────────────────────────────────────────
// Create
// ──────────────────────────────────────────────
export interface CreateAvailabilityInput {
	mentorId: string;
	name: string;
	description: string;
	days: Day[];
	startTime: string;
	endTime: string;
	startDate: string;
	endDate: string;
	breakTimes: { startTime: string; endTime: string }[];
	slotDuration: SlotDuration;
	bufferTime: number;
	priority: number;
}

export interface CreateAvailabilityResponse {
	availabilityId: string;
}

// ──────────────────────────────────────────────
// Update
// ──────────────────────────────────────────────
export interface UpdateAvailabilityInput {
	mentorId: string;
	availabilityId: string;
	name?: string;
	description?: string;
	days?: Day[];
	startTime?: string;
	endTime?: string;
	startDate?: string;
	endDate?: string;
	breakTimes?: { startTime: string; endTime: string }[];
	slotDuration?: SlotDuration;
	bufferTime?: number;
	priority?: number;
	status?: boolean;
}

export interface UpdateAvailabilityResponse {
	availabilityId: string;
}

// ──────────────────────────────────────────────
// Delete
// ──────────────────────────────────────────────
export interface DeleteAvailabilityInput {
	mentorId: string;
	availabilityId: string;
}

export interface ReenableAvailabilityInput {
	mentorId: string;
	availabilityId: string;
}

// ──────────────────────────────────────────────
// Get
// ──────────────────────────────────────────────
export interface GetMentorAvailabilitiesInput {
	mentorId: string;
	expired?: boolean;
}

export interface AvailabilityDto {
	id: string;
	mentorId: string;
	name: string;
	description: string;
	days: Day[];
	startTime: string;
	endTime: string;
	startDate: string;
	endDate: string;
	breakTimes: { startTime: string; endTime: string }[];
	slotDuration: SlotDuration;
	bufferTime: number;
	priority: number;
	status: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface GetMentorAvailabilitiesResponse {
	availabilities: AvailabilityDto[];
}
