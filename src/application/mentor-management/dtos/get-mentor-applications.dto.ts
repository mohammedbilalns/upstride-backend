export interface GetMentorApplicationsInput {
	page: number;
	limit: number;
	status?: "approved" | "rejected" | "pending";
	sort?: "recent" | "old" | "status";
}

export interface MentorApplicationDTO {
	id: string;
	userId: string;
	name: string;
	email: string;
	organization: string;
	yearsOfExperience: number;
	currentRole: string;
	expertises: string[];
	skills: {
		name: string;
		level: string;
	}[];
	status: "approved" | "rejected" | "pending";
	appliedAt: Date;
	updatedAt: Date;
}

export interface GetMentorApplicationsResponse {
	items: MentorApplicationDTO[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
