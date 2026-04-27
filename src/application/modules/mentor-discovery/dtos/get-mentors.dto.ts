export interface GetMentorsInput {
	page: number;
	limit: number;
	excludeUserId?: string;
	search?: string;
	category?: string;
	tierName?: string;
	minExperience?: number;
	maxExperience?: number;
	sort?: "rating" | "recent";
	isAdminView?: boolean;
}

export interface MentorDiscoveryDto {
	id: string;
	userId: string;
	name: string;
	avatar?: string;
	designation?: string;
	bio: string;
	yearsOfExperience: number;
	avgRating: number;
	tierName: string | null;
	categoryIds: string[];
	categories: {
		id: string;
		name?: string;
	}[];
	skills: {
		id: string;
		name?: string;
	}[];
	createdAt: Date;
}

export interface GetMentorFeedInput {
	page: number;
	limit: number;
	userId: string;
}

export interface GetMentorsResponse {
	items: MentorDiscoveryDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
