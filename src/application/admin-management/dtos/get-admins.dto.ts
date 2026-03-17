import type { UserRole } from "../../../domain/entities/user.entity";

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
	role: UserRole;
	coinBalance: number;
	joinedAt: Date;
	status: "active" | "blocked";
}

export interface GetAdminsResponse {
	admins: AdminListDTO[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
