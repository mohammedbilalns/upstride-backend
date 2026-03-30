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
}

export interface CreateAvailabilityResponse {
	availabilityId: string;
}

// ──────────────────────────────────────────────
// Check + Create
// ──────────────────────────────────────────────
export interface CheckAndCreateAvailabilityResponse {
	created: boolean;
	availability?: AvailabilityDto;
	conflicts?: AvailabilityDto[];
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
	status?: "active" | "disabled";
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
	status: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface GetMentorAvailabilitiesResponse {
	availabilities: AvailabilityDto[];
}
