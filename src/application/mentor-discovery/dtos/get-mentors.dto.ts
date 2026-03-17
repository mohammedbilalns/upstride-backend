export interface GetMentorsInput {
	page: number;
	limit: number;
	search?: string;
	categoryId?: string;
	tierId?: string;
	minExperience?: number;
	maxExperience?: number;
	sort?: "rating" | "recent";
}

export interface MentorDiscoveryDto {
	id: string;
	userId: string;
	name: string;
	bio: string;
	yearsOfExperience: number;
	avgRating: number;
	tierId: string | null;
	categoryIds: string[];
	categories: {
		id: string;
		name?: string;
	}[];
	createdAt: Date;
}

export interface GetMentorsResponse {
	items: MentorDiscoveryDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
