export interface GetAdminsInput {
	page: number;
	limit: number;
	search?: string;
	status?: "active" | "blocked";
	sort?: "recent" | "old";
}

export interface AdminListDTO {
	id: string;
	name: string;
	email: string;
	addedAt: Date;
	status: "active" | "blocked";
}

export interface GetAdminsResponse {
	admins: AdminListDTO[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	totalAdmins: number;
	activeAdmins: number;
	blockedAdmins: number;
}
