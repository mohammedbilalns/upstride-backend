import type {
	Day,
	SlotDuration,
} from "../../../../domain/entities/availability.entity";

// ──────────────────────────────────────────────
// Create
// ──────────────────────────────────────────────
export interface CreateAvailabilityInput {
	userId: string;
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
	conflicts?: ConflictAvailabilitySummary[];
}

export interface ConflictAvailabilitySummary {
	name: string;
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
}

// ──────────────────────────────────────────────
// Update
// ──────────────────────────────────────────────
export interface UpdateAvailabilityInput {
	userId: string;
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

export interface CheckAndUpdateAvailabilityResponse {
	updated: boolean;
	availability?: AvailabilityDto;
	conflicts?: ConflictAvailabilitySummary[];
}

// ──────────────────────────────────────────────
// Delete
// ──────────────────────────────────────────────
export interface DeleteAvailabilityInput {
	userId: string;
	availabilityId: string;
}

export interface ReenableAvailabilityInput {
	userId: string;
	availabilityId: string;
}

export interface CheckAndReenableAvailabilityResponse {
	enabled: boolean;
	conflicts?: ConflictAvailabilitySummary[];
}

// ──────────────────────────────────────────────
// Get
// ──────────────────────────────────────────────
export interface GetMentorAvailabilitiesInput {
	userId: string;
	expired?: boolean;
	status?: "active" | "disabled";
	page?: number;
	limit?: number;
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
	pagination?: {
		page: number;
		limit: number;
		totalPages: number;
		totalCount: number;
	};
}
