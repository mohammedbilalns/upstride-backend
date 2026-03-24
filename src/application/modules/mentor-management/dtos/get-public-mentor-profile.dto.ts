export interface PublicMentorSlotDto {
	id: string;
	startTime: Date;
	endTime: Date;
	durationMinutes: number;
	price: number;
	currency: "coins";
}

export interface PublicMentorProfileDto {
	id: string;
	user: {
		id: string;
		name: string;
		avatar?: string;
	};
	bio: string;
	organization: string;
	currentRole: {
		id: string;
		name: string;
	};
	personalWebsite: string | null;
	educationalQualifications: string[];
	expertises: { id: string; name: string }[];
	skills: { id: string; name: string; level: string }[];
	yearsOfExperience: number;
	avgRating: number;
}

export interface GetPublicMentorProfileInput {
	mentorId: string;
	requesterUserId: string;
}

export interface GetPublicMentorProfileResponse {
	profile: PublicMentorProfileDto;
	nextAvailableSessions: PublicMentorSlotDto[];
}
