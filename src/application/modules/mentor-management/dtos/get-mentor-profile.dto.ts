export interface MentorProfileDto {
	id: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
	bio: string;
	organization: string;
	currentRole: {
		id: string;
		name: string;
	};
	personalWebsite: string | null;
	educationalQualifications: string[];
	expertises: {
		id: string;
		name: string;
	}[];
	skills: {
		id: string;
		name: string;
		level: string;
	}[];
	tierName: string | null;
	tierMax30minPayment: number | null;
	currentPricePer30Min: number | null;
	mentorSessionEarningPercentage: number;
}

export interface GetMentorProfileInput {
	userId: string;
	viewerUserId?: string;
}

export interface GetMentorProfileResponse {
	profile: MentorProfileDto;
	isReported?: boolean;
}
