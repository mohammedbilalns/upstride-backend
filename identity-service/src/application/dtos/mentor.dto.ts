import type { Mentor } from "../../domain/entities";

export interface MentorRegistrationDTO {
	userId: string;
	bio: string;
	currentRole: string;
	organisation: string;
	yearsOfExperience: number;
	educationalQualifications: string[];
	personalWebsite?: string | "";
	expertise: string;
	skills: string[];
	resume: {
		public_id: string;
		original_filename: string;
		resource_type: string;
		secure_url: string;
		bytes: number;
		asset_folder: string;
	};
	termsAccepted: boolean;
}

export interface updateMentoDto {
	userId: string;
	bio: string;
	currentRole: string;
	organisation: string;
	yearsOfExperience: number;
	educationalQualifications: string[];
	personalWebsite?: string | "";
	expertise: string;
	skills: string[];
	resume: {
		public_id: string;
		original_filename: string;
		resource_type: string;
		secure_url: string;
		bytes: number;
		asset_folder: string;
	};
	termsAccepted: boolean;
}

export interface fetchMentorDto {
	page: number;
	limit: number;
	query?: string;
	status?: "pending" | "approved" | "rejected";
}

export interface findByExpertiseandSkillDto {
	page: number;
	limit: number;
	userId: string;
	query?: string;
	expertiseId?: string;
	skillId?: string;
}

export interface approveMentorDto {
	mentorId: string;
}

export interface rejectMentorDto {
	mentorId: string;
	rejectionReason: string;
}
export interface findAllMentorsDto {
	page: number;
	limit: number;
	query?: string;
	status?: "pending" | "approved" | "rejected";
}

export interface findAllMentorsResponseDto {
	mentors: Mentor[];
	totalMentors: number;
	totalPending: number;
	totalApproved: number;
	totalRejected: number;
}

export type MentorDetailsDto = Mentor & { isFollowing: boolean };
